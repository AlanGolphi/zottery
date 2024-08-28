// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from '@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol';
import {VRFV2PlusClient} from '@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol';
import {AutomationCompatibleInterface} from '@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol';

contract MyRaffle is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
  error Raffle__SpendMoreToEnterRaffle();
  error Raffle__RaffleNotOpen();
  error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 playerNums, uint256 raffleState);

  enum RaffleState {
    OPEN,
    CALCULATING
  }

  uint256 private immutable i_subscriptionId;
  bytes32 private immutable i_gasLane;
  uint32 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATION = 3;
  uint32 private constant NUM_WORDS = 1;
  uint256 private immutable i_interval;
  uint256 private immutable i_entranceFee;
  
  uint256 private lastTimeStamp;
  uint256 private currentOrder;
  RaffleState private raffleState;

  mapping(uint256 => uint256) private orderToWinnerIdx;
  mapping(uint256 => address payable[]) private orderToPlayers;

  event EnterRaffle(uint256 indexed currentOrder, address indexed player);
  event RequestRaffleWinner(uint256 indexed requestId);
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
    currentOrder = 0;
    raffleState = RaffleState.OPEN;
  }

  function enterRaffle() public payable {
    if (msg.value < i_entranceFee) {
      revert Raffle__SpendMoreToEnterRaffle();
    }
    if (raffleState != RaffleState.OPEN) {
      revert Raffle__RaffleNotOpen();
    }

    orderToPlayers[currentOrder].push(payable(msg.sender));
    emit EnterRaffle(currentOrder, msg.sender);
  }

  function checkUpkeep(
    bytes calldata checkData
  ) external returns (bool upkeepNeeded, bytes memory performData) {}

  function performUpkeep(bytes calldata performData) external {}

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] calldata randomWords
  ) internal override {}
}
