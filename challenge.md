## Challenge 1: Implement Loading/Pending Indicators

Goal: Provide clear visual feedback to the user while the application is waiting for asynchronous operations to complete. This prevents confusion and reassures the user that the application is working.

Specifics:
Modify the "Send Tokens" button or the surrounding UI to display loading indicators (like spinners) during two key phases:

Waiting for Wallet Confirmation: After the user clicks "Send Tokens" but before they have approved the transaction in their MetaMask wallet. Display a message like "Confirming in wallet..." alongside a spinner.

Waiting for Transaction Mining: After the user confirms the transaction in MetaMask, while the transaction is being processed and mined on the blockchain. Display a message like "Mining transaction..." or "Sending transaction..." with a spinner.

Hints:

Use component state variables (e.g., isPending, isConfirming) to track the application's status.

Implement conditional rendering within your button component. Based on the state variables, render either the default button text, an error message, or the appropriate loading indicator and text.

Consider using a library for spinner components (like react-spinners or an icon library like react-icons which includes spinners, e.g., CgSpinner).



## Challenge 2: Persist User Inputs with Local Storage

Goal: Prevent users from losing their entered data (token address, recipient list, amount list) if they accidentally close the tab or refresh the page.

Specifics:
Utilize the browser's local storage to save the content of the "Token Address", "Recipients", and "Amounts" input fields. When the application loads, check local storage for any saved data and automatically populate the input fields if found.

Hints:

Use the localStorage.setItem('key', value) method to save data. This should typically happen whenever the input field's corresponding state variable changes.

Use the localStorage.getItem('key') method to retrieve data. This should happen when the component mounts (loads for the first time).

React's useEffect hook is ideal for managing these side effects:

A useEffect with an empty dependency array ([]) runs once when the component mounts – suitable for retrieving data from local storage.

Separate useEffect hooks with specific dependencies (e.g., [tokenAddress]) run whenever that particular piece of state changes – suitable for saving data to local storage.

## Challenge 3: Display Dynamic Token Transaction Details

Goal: Provide the user with immediate, clear information about the token they are interacting with and the total amount they are preparing to send, based on their inputs.

Specifics:
Add a new section or display area in your UI that shows the following details, updating dynamically as the user enters information:

Token Name: Read the name property directly from the ERC20 token contract specified in the "Token Address" input.

Total Amount (wei): Calculate the sum of all valid numerical values entered in the "Amounts" input field.

Total Amount (tokens): Convert the calculated total wei amount into the standard token unit display. This requires reading the decimals property from the token contract and using it to format the total wei value correctly (e.g., dividing by 10 ** decimals). This value should update as the user types in the amounts field.

Hints:

You'll need to interact with the token contract on the blockchain to read its name and decimals.

Use a library like Wagmi to simplify blockchain interactions.

Performance Tip: Instead of making multiple separate calls (e.g., using useReadContract for name, then again for decimals), use the useReadContracts hook (plural) from Wagmi. This hook allows you to batch multiple read calls into a single request, improving performance.

Parse the amounts input (remembering it can be comma or newline separated) and sum the values. Ensure robust error handling for non-numeric inputs.

Use the fetched decimals value to format the total wei sum into a human-readable token amount (e.g., using ethers.utils.formatUnits or equivalent logic).