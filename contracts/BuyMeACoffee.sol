//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Deployed t goerli at 0x75AcEd6474a5AfE88Bd18E0d500F9775423137EC

contract BuyMeACoffee {
    // Event to emit when a memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string message
    );

    //Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all Memos received from friends.
    //The struct of the Memo bellow was defined above.
    Memo[] memos;

    //address of the contract deployer.
    address payable owner;

    //Deploy logic.
    constructor() {
        owner = payable(msg.sender);
    }

    /**
    *@dev buy a coffee for contract owner
    *@param _name name of the coffee buyer
    *@param _message a nice massage from the coffee buyer
    */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy coffee wiht 0 ETH.");
        
        //memos.push. will save this Memo to the memos array created above
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Exit a log event when a memo is created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            //_name,
            _message
        );
    } 

    /**
    *@dev send the entire balance in this contract to the owner.
    */
    function withdrawTips() public {
        // address(this).balance is Where the money is stored.
        require(owner.send(address(this).balance));

    }
    
    /**
    *@dev retrieve all the memos stored on the blockchain.
    */
    function getMemos() public view returns(Memo[] memory) {
        return memos;

    }
}