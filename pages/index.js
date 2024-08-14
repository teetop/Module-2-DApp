import { useEffect, useState } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Claims.sol/Claims.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [claimsContract, setClaimsContract] = useState(undefined);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [balance, setBalance] = useState("");
  const [isUserViewed, setIsUserViewed] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getClaimsContract();
  };

  const getClaimsContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const smartContract = new ethers.Contract(contractAddress, atmABI, signer);

    setClaimsContract(smartContract);
  };

  const yourBalance = async (userAddress) => {
    if (claimsContract) {
      try {
        const bal = await claimsContract.yourBalance();
        setBalance(bal);
      } catch (error) {
        alert(`Error: ${error}`);
        setBalance(0);
      }
    }
  };

  const addBenefitiary = async (_address, _amount, _time) => {
    if (claimsContract) {
      try {
        const addTx = await claimsContract.addBenefitiary(
          _address,
          _amount,
          _time
        );
        await addTx.wait();

        alert(`${_address} added as beneficiary successfully`);
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };

  const claimBenefit = async () => {
    if (claimsContract) {
      try {
        const claimTx = await claimsContract.claimBenefit();
        await claimTx.wait();

        alert("Benefit claimed successfully");
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await yourBalance();
    setIsUserViewed(true);
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    await addBenefitiary(address, amount, time);
  };

  const initUser = () => {
    const buttonStyle = {
      backgroundColor: "#00796b",
      color: "white",
      padding: "15px 35px",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
      fontSize: "16px",
      margin: "4px 2px",
      cursor: "pointer",
      borderRadius: "12px", // Curved edges
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", // Shadow
      border: "none",
      justifyContent: "center",
    };

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button style={buttonStyle} onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    return (
      <div className="split-container">
        <div className="left-pane">
          <div className="admin">Admin</div>
          <form className="form" onSubmit={handleAddBeneficiary}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x...."
              className="input"
            />
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="above 0"
              className="input"
            />
            <label htmlFor="time">Time</label>
            <input
              type="number"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="above 0"
              className="input"
            />
            <button type="submit" className="button">
              Add Beneficiary
            </button>
          </form>
        </div>

        <div className="right-pane">
          <div className="button-container">
            <button type="submit" className="button" onClick={claimBenefit}>
              Claim Benefit
            </button>
            <div className="separator"></div>
            <button type="submit" className="button" onClick={handleSubmit}>
              Check Balance
            </button>
          </div>

          {isUserViewed && (
            <>
              <p className="balance-info">{`Balance: ${balance}`}</p>
            </>
          )}
        </div>

        <style jsx>{`
          .split-container {
            display: flex;
            height: 70vh;
            width: 100%;
            font-family: Arial, sans-serif;
          }

          .left-pane,
          .right-pane {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .left-pane {
            background-color: #b2dfdb; /* Light teal background */
          }

          .right-pane {
            background-color: #80cbc4; /* Medium teal background */
          }

          .form {
            width: 80%;
          }

          .admin {
            margin: 0;
            font-size: 2em;
            font-weight: bold;
            text-align: center;
            font-family: "Roboto", sans-serif;
          }

          .input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1em;
          }

          .button-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .button {
            background-color: #00796b;
            color: white;
            border: none;
            padding: 10px 20px;
            margin: 10px 0;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            width: 100%;
            max-width: 200px;
          }

          .button:hover {
            background-color: #00695c;
          }

          .separator {
            width: 100%;
            height: 1px;
            background-color: #ccc;
            margin: 20px 0;
          }

          .balance-info {
            font-size: 1.5em;
            margin: 20px 0;
            color: #333;
          }
        `}</style>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <div className="box">
        <header className="header">
          <h1>Claims</h1>
        </header>
        {initUser()}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 97vh;
          background-color: #004d40; /* Dark teal background */
          font-family: "Roboto", sans-serif; /* Modern font */
        }

        .box {
          border: none;
          border-radius: 20px;
          padding: 40px;
          background-color: #ffffff; /* White background */
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); /* Larger shadow */
          transition: transform 0.3s ease; /* Smooth transition */
        }

        .box:hover {
          transform: translateY(-10px); /* Lift on hover */
        }

        .header {
          background-color: #00796b; /* Cool teal */
          color: #ffffff;
          padding: 15px 30px;
          border-radius: 15px;
          margin-bottom: 35px;
          text-align: center;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); /* Shadow for the header */
        }

        .header h1 {
          margin: 0;
          font-size: 2.5em; /* Larger font size */
          font-weight: bold;
        }
      `}</style>
    </main>
  );
}
