1. Create a basic react/nextjs application ✅
2. Connect our wallet with a nicer connect application (RAINBOWKIT) ✅
3. Implement this function
```javascript
function airdropERC20(
        address tokenAddress, // ERC20 token contract address
        address[] calldata recipients, // An array of the eligible recipients(addresses) for the airdrop
        uint256[] calldata amounts, // The amount they(the recipients) get
        uint256 totalAmount
    )
```
1. E2E Testing
   1. When we connect, we see the form
   2. When disconnected, we don't
2. Deploy to fleek