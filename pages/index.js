import { useEffect, useState } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Game.sol/Game.json";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [gameContract, setGameContract] = useState(undefined);

  const [guess, setGuess] = useState("");
  const [gameMoney, setGameMoney] = useState("");
  const [balAdd, setBalAdd] = useState("");
  const [mist, setMist] = useState("");
  const [balance, setBalance] = useState("");
  const [isUserViewed, setIsUserViewed] = useState(false);
  const [step, setStep] = useState(0);

  const contractAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
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
      setStep(1);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      toast.error("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getERC20Contract();
  };

  const getERC20Contract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);

    setGameContract(contract);
  };

  const balanceOf = async (userAddress) => {
    if (gameContract) {
      try {
        const bal = await gameContract.balanceOf(userAddress);
        setBalance(bal);
      } catch (error) {
        toast.error(`Error: ${error}`);
        setBalance(0);
      }
    }
  };

  const setMistery = async (mistery) => {
    if (gameContract) {
      try {
        const misteryTx = await gameContract.setMistery(mistery);
        await misteryTx.wait();

        toast.success(`Mistery set!`);
        setStep(2);
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    }
  };

  const playGame = async (gameAmount, gue) => {
    if (gameContract) {
      try {
        const playTx = await gameContract.playGame(gameAmount, gue);
        const result = await playTx.wait();

        const event = result.events.find(
          (event) => event.event === "GamePlayed"
        );
        const gameResult = event.args.result;

        toast.success(`${gameResult}`);
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    }
  };

  const handleMist = async (e) => {
    e.preventDefault();
    await setMistery(mist);
  };

  const handlePlay = async (e) => {
    e.preventDefault();
    await playGame(gameMoney, guess);
  };

  const handleBal = async (e) => {
    e.preventDefault();
    await balanceOf(balAdd);
    setIsUserViewed(true);
  };

  useEffect(() => {
    getWallet();
  }, []);

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <button style={buttonStyle} onClick={connectAccount}>
            Please connect your Metamask wallet
          </button>
        );

      case 1:
        return (
          <div>
            <form className="form" onSubmit={handleMist}>
              <label htmlFor="address">Mistery</label>
              <input
                type="text"
                id="address"
                value={mist}
                onChange={(e) => setMist(e.target.value)}
                placeholder="A-Z"
                className="input"
              />
              <button type="submit" className="button">
                Set Mistery
              </button>
            </form>

            <style jsx>{`
              .form {
                width: 80%;
              }

              .input {
                width: 100%;
                padding: 12px;
                margin: 12px 0;
                border: 1px solid #2e3a59;
                border-radius: 8px;
                font-size: 1em;
                transition: border-color 0.3s ease-in-out; /* Smooth transition */
              }

              .input:focus {
                border-color: #91b8d9; /* Highlight on focus */
                outline: none;
              }

              .button {
                background-color: #1e90ff; /* Cool blue */
                color: white;
                border: none;
                padding: 12px 25px;
                margin: 12px 0;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1em;
                width: 100%;
                max-width: 220px;
                transition: background-color 0.3s ease-in-out,
                  transform 0.3s ease-in-out; /* Smooth transition */
              }

              .button:hover {
                background-color: #1c75d8; /* Darker blue on hover */
                transform: translateY(-3px); /* Slight lift on hover */
              }
            `}</style>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="right-pane">
              <form className="form" onSubmit={handlePlay}>
                <label htmlFor="address">Amount</label>
                <input
                  type="number"
                  id="address"
                  value={gameMoney}
                  onChange={(e) => setGameMoney(e.target.value)}
                  placeholder="100"
                  className="input"
                />
                <label htmlFor="mis">Guess</label>
                <input
                  type="text"
                  id="mis"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="A-Z"
                  className="input"
                />
                <button type="submit" className="button">
                  Play Game
                </button>
              </form>

              <div className="separator"></div>

              <form className="form" onSubmit={handleBal}>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={balAdd}
                  onChange={(e) => setBalAdd(e.target.value)}
                  placeholder="0x...."
                  className="input"
                />
                <button type="submit" className="button">
                  Balance
                </button>
              </form>

              {isUserViewed && (
                <p className="balance-info">{`Balance: ${balance}`}</p>
              )}
            </div>

            <style jsx>{`
              .form {
                width: 80%;
              }

              .input {
                width: 100%;
                padding: 12px;
                margin: 12px 0;
                border: 1px solid #2e3a59;
                border-radius: 8px;
                font-size: 1em;
                transition: border-color 0.3s ease-in-out;
              }

              .input:focus {
                border-color: #91b8d9;
                outline: none;
              }

              .button {
                background-color: #1e90ff;
                color: white;
                border: none;
                padding: 12px 25px;
                margin: 12px 0;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1em;
                width: 100%;
                max-width: 220px;
                transition: background-color 0.3s ease-in-out,
                  transform 0.3s ease-in-out;
              }

              .button:hover {
                background-color: #1c75d8;
                transform: translateY(-3px);
              }

              .separator {
                width: 100%;
                height: 1px;
                background-color: #4f4f4f;
                margin: 15px 0;
              }
            `}</style>
          </div>
        );

      default:
        return null;
    }
  };

  const buttonStyle = {
    backgroundColor: "#5A67D8",
    color: "white",
    padding: "15px 35px",
    textAlign: "center",
    textDecoration: "none",
    transition: "all 0.3s ease",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    borderRadius: "12px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    border: "none",
    justifyContent: "center",
    display: "inline-block",
  };

  return (
    <main className="container">
      <div className="box">
        <header className="header">
          <h1>Guess Game</h1>
        </header>
        {renderStepContent()}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea, #764ba2);
          font-family: "Poppins", sans-serif;
          padding: 2rem;
        }

        .box {
          max-width: 700px;
          width: 100%;
          padding: 50px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
          transform: scale(1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .box:hover {
          transform: scale(1.02);
        }

        .header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .button {
          background-color: #5a67d8;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          text-align: center;
          box-shadow: 0 8px 16px rgba(90, 103, 216, 0.3);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .button:hover {
          background-color: #434190;
          box-shadow: 0 12px 24px rgba(67, 65, 144, 0.4);
        }
      `}</style>
    </main>
  );
}
