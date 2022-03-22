const pawns = {
	white_home: {
		"2a": [ ["3a", "2a"], ["4a", "2a"] ],
		"2b": [ ["3b", "2b"], ["4b", "2b"] ],
		"2c": [ ["3c", "2c"], ["4c", "2c"] ],
		"2d": [ ["3d", "2d"], ["4d", "2d"] ],
		"2e": [ ["3e", "2e"], ["4e", "2e"] ],
		"2f": [ ["3f", "2f"], ["4f", "2f"] ],
		"2g": [ ["3g", "2g"], ["4g", "2g"] ],
		"2h": [ ["3h", "2h"], ["4h", "2h"] ],
	},
	white_empty: {
		"3a": [["4a", "3a"]],
		"3b": [["4b", "3b"]],
		"3c": [["4c", "3c"]],
		"3d": [["4d", "3d"]],
		"3e": [["4e", "3e"]],
		"3f": [["4f", "3f"]],
		"3g": [["4g", "3g"]],
		"3h": [["4h", "3h"]],
		"4a": [["5a", "4a"]],
		"4b": [["5b", "4b"]],
		"4c": [["5c", "4c"]],
		"4d": [["5d", "4d"]],
		"4e": [["5e", "4e"]],
		"4f": [["5f", "4f"]],
		"4g": [["5g", "4g"]],
		"4h": [["5h", "4h"]],
		"5a": [["6a", "5a"]],
		"5b": [["6b", "5b"]],
		"5c": [["6c", "5c"]],
		"5d": [["6d", "5d"]],
		"5e": [["6e", "5e"]],
		"5f": [["6f", "5f"]],
		"5g": [["6g", "5g"]],
		"5h": [["6h", "5h"]],
	},
	white_attack: {
		"6a": [["7b", "6a"]],
		"6b": [["7a", "6b"], ["7c", "6b"]],
		"6c": [["7b", "6c"], ["7d", "6c"]],
		"6d": [["7c", "6d"], ["7e", "6d"]],
		"6e": [["7d", "6e"], ["7f", "6e"]],
		"6f": [["7e", "6f"], ["7g", "6f"]],
		"6g": [["7f", "6g"], ["7h", "6g"]],
		"6h": [["7g", "6h"]]
	},
	black_attack: {
		"3a": [["2b", "3a"]],
		"3b": [["2a", "3b"], ["2c", "3b"]],
		"3c": [["2b", "3c"], ["2d", "3c"]],
		"3d": [["2c", "3d"], ["2e", "3d"]],
		"3e": [["2d", "3e"], ["2f", "3e"]],
		"3f": [["2e", "3f"], ["2g", "3f"]],
		"3g": [["2f", "3g"], ["2h", "3g"]],
		"3h": [["2g", "3h"]]
	},
	black_empty: {
		"4a": [["3a", "4a"]],
		"4b": [["3b", "4b"]],
		"4c": [["3c", "4c"]],
		"4d": [["3d", "4d"]],
		"4e": [["3e", "4e"]],
		"4f": [["3f", "4f"]],
		"4g": [["3g", "4g"]],
		"4h": [["3h", "4h"]],
		"5a": [["4a", "5a"]],
		"5b": [["4b", "5b"]],
		"5c": [["4c", "5c"]],
		"5d": [["4d", "5d"]],
		"5e": [["4e", "5e"]],
		"5f": [["4f", "5f"]],
		"5g": [["4g", "5g"]],
		"5h": [["4h", "5h"]],
		"6a": [["5a", "6a"]],
		"6b": [["5b", "6b"]],
		"6c": [["5c", "6c"]],
		"6d": [["5d", "6d"]],
		"6e": [["5e", "6e"]],
		"6f": [["5f", "6f"]],
		"6g": [["5g", "6g"]],
		"6h": [["5h", "6h"]],
	},
	black_home: {
		"7a": [ ["6a", "7a"], ["5a", "7a"] ],
		"7b": [ ["6b", "7b"], ["5b", "7b"] ],
		"7c": [ ["6c", "7c"], ["5c", "7c"] ],
		"7d": [ ["6d", "7d"], ["5d", "7d"] ],
		"7e": [ ["6e", "7e"], ["5e", "7e"] ],
		"7f": [ ["6f", "7f"], ["5f", "7f"] ],
		"7g": [ ["6g", "7g"], ["5g", "7g"] ],
		"7h": [ ["6h", "7h"], ["5h", "7h"] ],
	},
}

const knight = {
	center_home: {
		"4d": [
			["6e", "4d"], ["6c", "4d"], ["3b", "4d"], ["5b", "4d"],["3f", "4d"], ["5f", "4d"]
		]
	},
	center_attack: {
		"5d": [
			["7c", "5d"], ["7e","5d"], ["3c", "5d"], ["3e", "5d"], ["4b", "5d"], ["6b", "5d"], ["6f", "5d"], ["4f", "5d"]
		]
	},
	edge_one: {
		"1b": [
			["3a", "1b"], ["3c", "1b"]
		],
		"1g": [
			["3f", "1g"], ["3h", "1g"]
		],
		"1d": [
			["3c", "1d"], ["3e", "1d"]
		]
	},
	edge_two: {
		"2a": [
			["3c", "2a"], ["4b", "2a"]
		],
		"7a": [
			["8c", "7a"], ["6c", "7a"], ["5b", "7a"]
		],
		"5a": [
			["6c", "5a"], ["4c", "5a"], ["3b", "5a"], ["7b", "5a"]
		]
	},
	edge_three: {
		"2h": [
			["4g", "2h"], ["3f", "2h"]
		],
		"5h": [
			["4f", "5h"], ["6f", "5h"], ["7g", "5h"], ["3g", "5h"]
		],
		"7h": [
			["8f", "7h"], ["6f", "7h"], ["5g", "7h"]
		]
	},
	edge_four: {
		"8b": [
			["6a", "8b"], ["6c", "8b"], ["7d", "8b"]
		],
		"8g": [
			["6f", "8g"], ["6h", "8g"], ["7e", "8g"]
		],
		"8d": [
			["6c", "8d"], ["6e", "8d"], ["7f", "8d"], ["7b", "8d"]
		]
	},
	corner_one: {
		"1a": [["3b", "1a"]]	
	},
	corner_two: {
		"1h": [["3g", "1h"]]
	}, 
	corner_three: {
		"8a": [["6b", "8a"], ["7c", "8a"]]
	},
	corner_four: {
		"8h": [["6g", "8h"], ["7f", "8h"]]
	},
  board1: {
    "4g" : [["3e", "4g"], ["2f", "4g"], ["6f", "4g"], ["6h", "4g"], ["5e", "4g"]]
  }
}
const king = {
	edges: {
		"1e": [
		],
		"5a": [
			["6b", "5a"], ["5b", "5a"], ["4b", "5a"], ["6a", "5a"], ["4a", "5a"]
		],
		"5h": [
			["6g", "5h"], ["5g", "5h"], ["4g", "5h"], ["6h", "5h"], ["4h", "5h"]
		],
		"8c": [
			["7b", "8c"], ["7c", "8c"], ["7d", "8c"], ["8b", "8c"], ["8d", "8c"]
		]
	},
	corners: {
		"1a": [
		],
		"1h": [
		],
		"8h": [
			["8g", "8h"], ["7g", "8h"], ["7h", "8h"]
		],
		"8a": [
			["8b", "8a"], ["7b", "8a"], ["7a", "8a"]
		]
	},
	middle: {
		"4d": [
			["3c", "4d"], ["3d", "4d"], ["3e", "4d"], ["5c", "4d"], ["5d", "4d"], ["5e", "4d"], ["4c", "4d"], ["4e", "4d"]
		]
	},
}
const board1 = [
  {
    "position": "8a",
    "color": "white",
    "piece": {
      "name": "♜",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "8b",
    "color": "black",
    "piece": {
      "name": "♞",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "8c",
    "color": "white",
    "piece": {
      "name": "♝",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "8d",
    "color": "black",
    "piece": {
      "name": "♛",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "8e",
    "color": "white",
    "piece": {
      "name": "♚",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "8f",
    "color": "black",
    "piece": {
      "name": "♝",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "8g",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "6f",
      "8h"
    ],
    "can_kill": null
  },
  {
    "position": "8h",
    "color": "black",
    "piece": {
      "name": "♜",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "7a",
    "color": "black",
    "piece": {
      "name": "♟",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "7b",
    "color": "white",
    "piece": {
      "name": "♟",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "7c",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "8d"
    ],
    "can_kill": null
  },
  {
    "position": "7d",
    "color": "white",
    "piece": {
      "name": "♟",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "7e",
    "color": "black",
    "piece": {
      "name": "♟",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "7f",
    "color": "white",
    "piece": {
      "name": "♟",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "7g",
    "color": "black",
    "piece": {
      "name": "♟",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "7h",
    "color": "white",
    "piece": {
      "name": "♟",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "6a",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7a",
      "8b"
    ],
    "can_kill": null
  },
  {
    "position": "6b",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7b",
      "8d"
    ],
    "can_kill": null
  },
  {
    "position": "6c",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "8b"
    ],
    "can_kill": null
  },
  {
    "position": "6d",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7d"
    ],
    "can_kill": null
  },
  {
    "position": "6e",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7e"
    ],
    "can_kill": null
  },
  {
    "position": "6f",
    "color": "black",
    "piece": {
      "name": "♞",
      "moves": 0
    },
    "can_move": [
      "7f",
      "8g"
    ],
    "can_kill": [
      "4g"
    ]
  },
  {
    "position": "6g",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7g"
    ],
    "can_kill": null
  },
  {
    "position": "6h",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7h"
    ],
    "can_kill": null
  },
  {
    "position": "5a",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7a",
      "8d"
    ],
    "can_kill": null
  },
  {
    "position": "5b",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7b"
    ],
    "can_kill": null
  },
  {
    "position": "5c",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "5d",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7d"
    ],
    "can_kill": null
  },
  {
    "position": "5e",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7e"
    ],
    "can_kill": null
  },
  {
    "position": "5f",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "4f"
    ],
    "can_kill": null
  },
  {
    "position": "5g",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7g"
    ],
    "can_kill": null
  },
  {
    "position": "5h",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "7h"
    ],
    "can_kill": null
  },
  {
    "position": "4a",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2a"
    ],
    "can_kill": null
  },
  {
    "position": "4b",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2b"
    ],
    "can_kill": null
  },
  {
    "position": "4c",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "4d",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2d"
    ],
    "can_kill": null
  },
  {
    "position": "4e",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2e",
      "6f"
    ],
    "can_kill": null
  },
  {
    "position": "4f",
    "color": "black",
    "piece": {
      "name": "♙",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "4g",
    "color": "white",
    "piece": {
      "name": "♘",
      "moves": 0
    },
    "can_move": null,
    "can_kill": [
      "6f"
    ]
  },
  {
    "position": "4h",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2h"
    ],
    "can_kill": null
  },
  {
    "position": "3a",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "1b",
      "2a"
    ],
    "can_kill": null
  },
  {
    "position": "3b",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2b"
    ],
    "can_kill": null
  },
  {
    "position": "3c",
    "color": "black",
    "piece": {
      "name": "♟",
      "moves": 0
    },
    "can_move": [
      "1b",
      "2c",
      "4c"
    ],
    "can_kill": [
      "1b",
      "2d",
      "2b"
    ]
  },
  {
    "position": "3d",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2d"
    ],
    "can_kill": null
  },
  {
    "position": "3e",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2e",
      "4g"
    ],
    "can_kill": null
  },
  {
    "position": "3f",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "3g",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2g"
    ],
    "can_kill": null
  },
  {
    "position": "3h",
    "color": "white",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "2h"
    ],
    "can_kill": null
  },
  {
    "position": "2a",
    "color": "white",
    "piece": {
      "name": "♙",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "2b",
    "color": "black",
    "piece": {
      "name": "♙",
      "moves": 0
    },
    "can_move": null,
    "can_kill": [
      "3c"
    ]
  },
  {
    "position": "2c",
    "color": "white",
    "piece": {
      "name": "♙",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "2d",
    "color": "black",
    "piece": {
      "name": "♙",
      "moves": 0
    },
    "can_move": null,
    "can_kill": [
      "3c"
    ]
  },
  {
    "position": "2e",
    "color": "white",
    "piece": {
      "name": "♙",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "2f",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "1e",
      "4g"
    ],
    "can_kill": null
  },
  {
    "position": "2g",
    "color": "white",
    "piece": {
      "name": "♙",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "2h",
    "color": "black",
    "piece": {
      "name": "♙",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "1a",
    "color": "black",
    "piece": {
      "name": "♖",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "1b",
    "color": "white",
    "piece": {
      "name": "♘",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "1c",
    "color": "black",
    "piece": {
      "name": "♗",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "1d",
    "color": "white",
    "piece": {
      "name": "♕",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "1e",
    "color": "black",
    "piece": {
      "name": "♔",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "1f",
    "color": "white",
    "piece": {
      "name": "♗",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  },
  {
    "position": "1g",
    "color": "black",
    "piece": {
      "name": null,
      "moves": null
    },
    "can_move": [
      "1h"
    ],
    "can_kill": null
  },
  {
    "position": "1h",
    "color": "white",
    "piece": {
      "name": "♖",
      "moves": 0
    },
    "can_move": null,
    "can_kill": null
  }
]

module.exports = {
	pawns,
	knight,
	king, 
  board1
}