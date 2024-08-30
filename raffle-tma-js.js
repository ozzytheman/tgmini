// Initialize TonConnect
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://your-app-url.com/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

// Set TMA return URL
tonConnectUI.uiOptions = {
    twaReturnUrl: 'https://t.me/your_bot_name'
};

// Raffle state
let prizePool = 0;
let participants = [];

// DOM elements
const enterRaffleButton = document.getElementById('enter-raffle');
const prizePoolElement = document.getElementById('prize-pool');
const participantCountElement = document.getElementById('participant-count');
const winnerInfoElement = document.getElementById('winner-info');
const winnerAddressElement = document.getElementById('winner-address');
const winnerPrizeElement = document.getElementById('winner-prize');

// Update UI
function updateUI() {
    prizePoolElement.textContent = prizePool;
    participantCountElement.textContent = participants.length;
}

// Handle wallet connection
tonConnectUI.onStatusChange(wallet => {
    if (wallet) {
        enterRaffleButton.style.display = 'block';
    } else {
        enterRaffleButton.style.display = 'none';
    }
});

// Enter raffle
enterRaffleButton.addEventListener('click', async () => {
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
            {
                address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA", // Replace with your raffle contract address
                amount: "1000000000", // 1 TON in nanotons
            }
        ]
    };

    try {
        const result = await tonConnectUI.sendTransaction(transaction);
        console.log("Transaction sent:", result);
        
        // Update raffle state
        prizePool += 1;
        participants.push(tonConnectUI.account.address);
        updateUI();
    } catch (e) {
        console.error("Error sending transaction:", e);
    }
});

// Simulate ending the raffle (in a real app, this would be done by the smart contract)
function endRaffle() {
    if (participants.length === 0) return;

    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winnerAddress = participants[winnerIndex];

    winnerAddressElement.textContent = winnerAddress;
    winnerPrizeElement.textContent = prizePool;
    winnerInfoElement.style.display = 'block';

    // Reset raffle
    prizePool = 0;
    participants = [];
    updateUI();
}

// For demonstration purposes, end the raffle after 5 minutes
setTimeout(endRaffle, 5 * 60 * 1000);

// Initial UI update
updateUI();
