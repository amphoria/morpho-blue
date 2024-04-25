import { ethers } from "ethers";

const inputEl = document.getElementById("input-el")
const updateBtn = document.getElementById("update-btn")
const saveBtn = document.getElementById("save-btn")
const totalBorrowAssetsEl = document.getElementById("total-borrow-assets")
const totalBorrowSharesEl = document.getElementById("total-borrow-shares")
const borrowSharesEl = document.getElementById("position-borrow-shares")
const collateralEl = document.getElementById("position-collateral")
const borrowAssetsEl = document.getElementById("position-borrow-assets")

// Morpho Blue Contract Address
const morphoBlueAddress = "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb"

const morphoBlueABI = 
[
    "function market(bytes32) view returns (uint128, uint128, uint128, uint128, uint128, uint128)",
    "function position(bytes32, address) view returns (uint256, uint128, uint128)"
]

const ethProvider = 
    new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/ca1b1cda8d6940e6af90ec7b1b8cf84d")

// osETH/WETH Market Id
const osETHWETHId = "0xD5211D0E3F4A30D5C98653D988585792BB7812221F04801BE73A44CEECB11E89"

// Ethers contract object
const morphoBlueContract = new ethers.Contract(morphoBlueAddress, morphoBlueABI, ethProvider)

// Default wallet address
const cookie = getCookie("defaultAddress")
if (cookie != "") {
    const defaultAddress = cookie.split('=')
    inputEl.value = defaultAddress[1]
} 

updateBtn.addEventListener("click", updatePosition)
saveBtn.addEventListener("click", saveAddress)

async function updatePosition() { 
    let result

    result = await morphoBlueContract.market(osETHWETHId)

    const {0: totalSupplyAssets, 1: totalSupplyShares, 2: totalBorrowAssets, 3: totalBorrowShares, 4: lastUpdate, 5: fee} = result

    totalBorrowAssetsEl.textContent = ethers.formatEther(totalBorrowAssets)
    totalBorrowSharesEl.textContent = ethers.formatEther(totalBorrowShares)

    result = await morphoBlueContract.position(osETHWETHId, inputEl.value)

    const {0: supplyShares, 1: borrowShares, 2: collateral} = result

    borrowSharesEl.textContent = ethers.formatEther(borrowShares)
    collateralEl.textContent = ethers.formatEther(collateral)

    const borrowAssets =  (totalBorrowAssets * borrowShares) / totalBorrowShares 

    borrowAssetsEl.textContent = ethers.formatEther(borrowAssets)
}

function saveAddress() {
    if (inputEl.value != "") {
        document.cookie = "defaultAddress=" + inputEl.value
    } else {
        console.log("No address entered")
    }
}

function getCookie(caddr) {
    let address = caddr + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(address) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


