// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from '@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol';
import {VRFV2PlusClient} from '@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol';
import {AutomationCompatibleInterface} from '@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol';

contract Raffle is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
  error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);
  error Raffle__TransferFailed();
  error Raffle__SendMoreToEnterRaffle();
  error Raffle__RafflerNotOpen();

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
  uint256 private s_lastTimeStamp;
  address private s_recentWinner;
  address payable[] private s_players;
  RaffleState private s_raffleState;

  event RequestedRaffleWinner(uint256 indexed requestId);
  event EnterRaffle(address indexed player);
  event WinnerPicked(address indexed player);

  constructor(
    uint256 subscriptionId,
    bytes32 gasLane,
    uint32 callbackGasLimit,
    uint256 interval,
    uint256 entranceFee,
    address vrfCordinatorV2
  ) VRFConsumerBaseV2Plus(vrfCordinatorV2) {
    i_subscriptionId = subscriptionId;
    i_gasLane = gasLane;
    i_callbackGasLimit = callbackGasLimit;
    i_interval = interval;
    i_entranceFee = entranceFee;
    s_lastTimeStamp = block.timestamp;
    s_raffleState = RaffleState.OPEN;
  }

  function enterRaffle() public payable {
    if (msg.value < i_entranceFee) {
      revert Raffle__SendMoreToEnterRaffle();
    }
    if (s_raffleState != RaffleState.OPEN) {
      revert Raffle__RafflerNotOpen();
    }
    s_players.push(payable(msg.sender));
    emit EnterRaffle(msg.sender);
  }

  function checkUpkeep(
    bytes memory
  ) public view override returns (bool upkeepNeeded, bytes memory) {
    bool isOpen = s_raffleState == RaffleState.OPEN;
    bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
    bool hasPlayers = s_players.length > 0;
    bool hasBalance = address(this).balance > 0;
    upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    return (upkeepNeeded, '0x0');
  }

  function performUpkeep(bytes calldata) external override {
    (bool upkeepNeeded, ) = checkUpkeep("");
    if (!upkeepNeeded) {
      revert Raffle__UpkeepNotNeeded(
        address(this).balance,
        s_players.length,
        uint256(s_raffleState)
      );
    }

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
    uint256 indexOfWinner = randomWords[0] % s_players.length;
    address payable recentWinner = s_players[indexOfWinner];
    s_recentWinner = recentWinner;
    s_players = new address payable[](0);
    s_lastTimeStamp = block.timestamp;
    emit WinnerPicked(recentWinner);
    (bool success, ) = recentWinner.call{value: address(this).balance}('');
    if (!success) {
      revert Raffle__TransferFailed();
    }
  }

  function getRaffleState() public view returns (RaffleState) {
    return s_raffleState;
  }

  function getNumWords() public pure returns (uint32) {
    return NUM_WORDS;
  }

  function getRequestConfirmation() public pure returns (uint16) {
    return REQUEST_COMFIRMATIONS;
  }

  function getRecentWinner() public view returns (address) {
    return s_recentWinner;
  }

  function getPlayer(uint256 index) public view returns (address) {
    return s_players[index];
  }

  function getLastTimeStamp() public view returns (uint256) {
    return s_lastTimeStamp;
  }

  function getInterval() public view returns (uint256) {
    return i_interval;
  }

  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getNumberOfPlayers() public view returns (uint256) {
    return s_players.length;
  }
}
