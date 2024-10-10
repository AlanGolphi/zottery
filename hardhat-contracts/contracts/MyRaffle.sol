// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from '@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol';
import {VRFV2PlusClient} from '@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol';
import {AutomationCompatibleInterface} from '@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol';

contract MyRaffle is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
  error Raffle__NotTheExactAmount();
  error Raffle__RaffleNotOpen();
  error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 playerNums, uint256 raffleState);
  error Raffle__TransferFailed();
  error Raffle__CurrentOrderNoWinner(uint256 currentOrder);

  enum RaffleState {
    OPEN,
    CALCULATING
  }

  uint256 private immutable i_subscriptionId;
  bytes32 private immutable i_gasLane;
  uint32 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_COMFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;
  uint256 private immutable i_interval;
  uint256 private immutable i_entranceFee;

  uint256 private lastTimeStamp;
  uint256 private currentOrder;
  RaffleState private raffleState;

  mapping(uint256 => uint256) private orderToWinnerIdx;
  mapping(uint256 => address payable[]) private orderToPlayers;

  event EnterRaffle(uint256 indexed currentOrder, address indexed player, uint256 betsNum);
  event RequestedRaffleWinner(uint256 indexed requestId);
  event WinnerPicked(uint256 indexed currentOrder, address indexed player);

  constructor(
    uint256 _subscriptionId,
    bytes32 _gasLane,
    uint32 _callbackGasLimit,
    uint256 _interval,
    uint256 _entranceFee,
    address _vrfCoordinator
  ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
    i_subscriptionId = _subscriptionId;
    i_gasLane = _gasLane;
    i_callbackGasLimit = _callbackGasLimit;
    i_interval = _interval;
    i_entranceFee = _entranceFee;
    lastTimeStamp = block.timestamp;
    currentOrder = 1;
    raffleState = RaffleState.OPEN;
  }

  function oneOffBet() external payable {
    if (msg.value != i_entranceFee) {
      revert Raffle__NotTheExactAmount();
    }
    if (raffleState != RaffleState.OPEN) {
      revert Raffle__RaffleNotOpen();
    }

    orderToPlayers[currentOrder].push(payable(msg.sender));
    emit EnterRaffle(currentOrder, msg.sender, 1);
  }

  function multiBets(uint256 betsNum) external payable {
    if (msg.value != i_entranceFee * betsNum) {
      revert Raffle__NotTheExactAmount();
    }
    if (raffleState != RaffleState.OPEN) {
      revert Raffle__RaffleNotOpen();
    }
    address payable sender = payable(msg.sender);
    for (uint256 i; i < betsNum; i++) {
      orderToPlayers[currentOrder].push(sender);
    }
    emit EnterRaffle(currentOrder, sender, betsNum);
  }

  function checkUpkeep(bytes memory) public view returns (bool upkeepNeeded, bytes memory) {
    bool isOpen = raffleState == RaffleState.OPEN;
    bool timePassed = (block.timestamp - lastTimeStamp) > i_interval;
    bool hasPlayers = orderToPlayers[currentOrder].length > 0;
    bool hasBalance = address(this).balance > 0;
    upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);

    return (upkeepNeeded, '');
  }

  function performUpkeep(bytes calldata) external override {
    (bool upkeepNeeded, ) = checkUpkeep('');
    if (!upkeepNeeded) {
      revert Raffle__UpkeepNotNeeded(
        address(this).balance,
        orderToPlayers[currentOrder].length,
        uint256(raffleState)
      );
    }

    raffleState = RaffleState.CALCULATING;

    uint256 requestId = s_vrfCoordinator.requestRandomWords(
      VRFV2PlusClient.RandomWordsRequest({
        keyHash: i_gasLane,
        subId: i_subscriptionId,
        requestConfirmations: REQUEST_COMFIRMATIONS,
        callbackGasLimit: i_callbackGasLimit,
        numWords: NUM_WORDS,
        extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
      })
    );

    emit RequestedRaffleWinner(requestId);
  }

  function fulfillRandomWords(uint256, uint256[] calldata randomWords) internal override {
    address payable[] memory players = orderToPlayers[currentOrder];
    uint256 winnerIdx = randomWords[0] % players.length;
    address payable winner = players[winnerIdx];
    orderToWinnerIdx[currentOrder] = winnerIdx;

    emit WinnerPicked(currentOrder, winner);
    currentOrder += 1;
    raffleState = RaffleState.OPEN;
    lastTimeStamp = block.timestamp;

    uint256 prizeAmount = address(this).balance;
    (bool success, ) = winner.call{value: prizeAmount}("");
    if (!success) {
      revert Raffle__TransferFailed();
    }
  }

  function getCurrentOrder() public view returns (uint256) {
    return currentOrder;
  }

  function getRaffleState() public view returns (uint256) {
    return uint256(raffleState);
  }

  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getLastTimeStamp() public view returns (uint256) {
    return lastTimeStamp;
  }

  function getInterval() public view returns (uint256) {
    return i_interval;
  }

  function getCurrentOrderPlayers() public view returns (address payable[] memory players) {
    players = orderToPlayers[currentOrder];
  }

  function getPlayersByOrder(uint256 order) public view returns (address payable[] memory players) {
    players = orderToPlayers[order];
  }

  function getRecentWinner() public view returns (address recentWinner) {
    if (currentOrder <= 1) {
      revert Raffle__CurrentOrderNoWinner(currentOrder);
    }
    uint256 previousOrder = currentOrder - 1;
    address payable[] memory previousOrderPlayers = orderToPlayers[previousOrder];
    uint256 previousWinnerIdx = orderToWinnerIdx[previousOrder];
    recentWinner = previousOrderPlayers[previousWinnerIdx];
  }

  function getWinnerByOrder(uint256 order) public view returns (address winner) {
    if (currentOrder <= 1 || (order > currentOrder - 1)) {
      revert Raffle__CurrentOrderNoWinner(currentOrder);
    }
    address payable[] memory orderPlayers = orderToPlayers[order];
    uint256 orderWinnerIdx = orderToWinnerIdx[order];
    winner = orderPlayers[orderWinnerIdx];
  }

  function getNumWords() public pure returns (uint32) {
    return NUM_WORDS;
  }

  function getRequestConfirmation() public pure returns (uint16) {
    return REQUEST_COMFIRMATIONS;
  }
}
