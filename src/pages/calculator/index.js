import React, { useState, useEffect } from "react";
import Web3 from "web3";

import "./styles.css";

import { calculatorABI } from "../../utils/constants";
import Bubbles from "../../components/bubbles";

function App() {
  const [operationMethod, setOperationMethod] = useState("add");
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [contractResult, setContractResult] = useState("");
  const [usageCount, setUsageCount] = useState("");
  const [digitA, setDigitA] = useState("");
  const [digitB, setDigitB] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showResult = isLoading
    ? "calculating in progress..."
    : `Result: ${contractResult}`;

  const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.enable();
        setIsMetamaskConnected(true);
        getUsageCount();
      } catch (error) {
        console.error("Помилка при підключенні Metamask:", error);
      }
    } else {
      console.error("Провайдер Ethereum не знайдено.");
    }
  };

  const getSenderAddress = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await web3.eth.requestAccounts();
        return accounts[0];
      } catch (error) {
        console.error("Помилка при отриманні адреси відправника:", error);
      }
    } else {
      console.error("Провайдер Ethereum не знайдено.");
    }
  };

  const getUsageCount = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      const contractAddress = "0x1851ffBce02A134eFd9ddBC91920b0c6DCEfB6f5";
      const contract = new web3.eth.Contract(calculatorABI, contractAddress);

      const senderAddress = await getSenderAddress();

      try {
        const count = await contract.methods
          .usageCount()
          .call({ from: senderAddress });
        setUsageCount(count?.toString());
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Ethereum provider not found.");
    }
  };

  const handleCalculate = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);

      const contractAddress = "0x1851ffBce02A134eFd9ddBC91920b0c6DCEfB6f5";
      const methodName = operationMethod;
      const a = parseInt(digitA);
      const b = parseInt(digitB);

      if (isNaN(a) || isNaN(b)) {
        console.error("Invalid input. Please enter valid numbers.");
        return;
      }

      const contract = new web3.eth.Contract(calculatorABI, contractAddress);

      const senderAddress = await getSenderAddress();

      try {
        setIsLoading(true);
        let result;
        if (methodName === "add") {
          try {
            await contract.methods.add(a, b).send({ from: senderAddress });
            result = await contract.methods
              .add(a, b)
              .call({ from: senderAddress });
          } catch (error) {
            console.log("Transaction failed:", error);
          }
        } else if (methodName === "subtract") {
          try {
            await contract.methods.subtract(a, b).send({ from: senderAddress });
            result = await contract.methods
              .subtract(a, b)
              .call({ from: senderAddress });
          } catch (error) {
            console.log("Transaction failed:", error);
          }
        } else if (methodName === "multiply") {
          try {
            await contract.methods.multiply(a, b).send({ from: senderAddress });
            result = await contract.methods
              .multiply(a, b)
              .call({ from: senderAddress });
          } catch (error) {
            console.log("Transaction failed:", error);
          }
        } else if (methodName === "divide") {
          try {
            await contract.methods.divide(a, b).send({ from: senderAddress });
            result = await contract.methods
              .divide(a, b)
              .call({ from: senderAddress });
          } catch (error) {
            console.log("Transaction failed:", error);
          }
        }

        const count = await contract.methods
          .usageCount()
          .call({ from: senderAddress });
        console.log(result);
        setContractResult(Number(result));
        setUsageCount(Number(count));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Ethereum provider not found.");
    }
  };

  useEffect(() => {
    const checkMetamaskConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setIsMetamaskConnected(true);
            getUsageCount();
          } else {
            setIsMetamaskConnected(false);
          }
        } catch (error) {
          console.error("Помилка перевірки підключення Metamask:", error);
        }
      } else {
        console.error("Провайдер Ethereum не знайдено.");
      }
    };

    checkMetamaskConnection();
  }, []);

  const handleDropdownChange = (event) => {
    setOperationMethod(event.target.value);
  };

  return (
    <div className="container container--bubbles">
      <div className="container button--conectMetamask">
        {isMetamaskConnected ? (
          <button className="button--Metamask-connected">
            Metamask connected
          </button>
        ) : (
          <button className="button--Metamask" onClick={connectMetamask}>
            Connect Metamask
          </button>
        )}
      </div>
      <Bubbles />
      <Bubbles />
      <Bubbles />
      <Bubbles />

      <div className="container container--calculator">
        <div>
          <input
            className="calculator__input"
            type="text"
            placeholder=" digit a"
            value={digitA}
            onChange={(e) => setDigitA(e.target.value)}
          />
        </div>

        <select
          className="calculator__select"
          onChange={handleDropdownChange}
          name="operations"
          id="operations"
        >
          <option value="add">+</option>
          <option value="subtract">-</option>
          <option value="divide">÷</option>
          <option value="multiply">*</option>
        </select>
        <div>
          <input
            className="calculator__input"
            type="text"
            placeholder=" digit b"
            value={digitB}
            onChange={(e) => setDigitB(e.target.value)}
          />
        </div>

        <div>
          {isMetamaskConnected && (
            <span className="calculator__result">{showResult}</span>
          )}
        </div>
        <div className="loader"></div>
        <div className="calculator__button">
          <button
            onClick={handleCalculate}
            className="calculator__calculate-button"
            disabled={!isMetamaskConnected}
          >
            Calculate
          </button>

          {isMetamaskConnected && (
            <label className="calculator__used-label" id="calculatorUsedLabel">
              Calculator used: {usageCount}
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
