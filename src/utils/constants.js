export const calculatorABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "operation",
        type: "string",
      },
      { indexed: true, internalType: "uint256", name: "a", type: "uint256" },
      { indexed: true, internalType: "uint256", name: "b", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    name: "Result",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "a", type: "uint256" },
      { internalType: "uint256", name: "b", type: "uint256" },
    ],
    name: "add",
    outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "a", type: "uint256" },
      { internalType: "uint256", name: "b", type: "uint256" },
    ],
    name: "divide",
    outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "a", type: "uint256" },
      { internalType: "uint256", name: "b", type: "uint256" },
    ],
    name: "multiply",
    outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "a", type: "uint256" },
      { internalType: "uint256", name: "b", type: "uint256" },
    ],
    name: "subtract",
    outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usageCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
