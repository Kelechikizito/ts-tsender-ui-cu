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