import React, { useState, useEffect } from "react";
import Web3 from "web3";

import "./styles.css";

import { calculatorABI } from "../../utils/constants";
import Bubbles from "../../components/bubbles";

function App() {
  const [operationMethod, setOperationMethod] = useState("");
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [result, setResult] = useState("");
  const [usageCount, setUsageCount] = useState("");
  const [digitA, setDigitA] = useState("");
  const [digitB, setDigitB] = useState("");

  const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.enable();
        setIsMetamaskConnected(true);
      } catch (error) {
        console.error("Error connecting Metamask:", error);
      }
    } else {
      console.error("Ethereum provider not found.");
    }
  };

  const getSenderAddress = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await web3.eth.requestAccounts();
        return accounts[0];
      } catch (error) {
        console.error("Error retrieving sender address:", error);
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

      // Додаткова перевірка на валідність числових значень
      if (isNaN(a) || isNaN(b)) {
        console.error("Invalid input. Please enter valid numbers.");
        return;
      }

      const contract = new web3.eth.Contract(calculatorABI, contractAddress);

      const senderAddress = await getSenderAddress();

      try {
        let result;
        if (methodName === "add") {
          result = await contract.methods
            .add(a, b)
            .send({ from: senderAddress });
        } else if (methodName === "subtract") {
          result = await contract.methods
            .subtract(a, b)
            .send({ from: senderAddress });
        } else if (methodName === "multiply") {
          result = await contract.methods
            .multiply(a, b)
            .send({ from: senderAddress });
        } else if (methodName === "divide") {
          result = await contract.methods
            .divide(a, b)
            .send({ from: senderAddress });
        }

        const count = await contract.methods
          .usageCount()
          .call({ from: senderAddress });
        console.log(result);
        setResult(result?.toString());

        setUsageCount(count?.toString());
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Ethereum provider not found.");
    }
  };

  useEffect(() => {
    const checkMetamaskConnection = () => {
      if (
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isMetaMask &&
        window.ethereum.isConnected()
      ) {
        setIsMetamaskConnected(true);
      } else {
        setIsMetamaskConnected(false);
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
        {!isMetamaskConnected ? (
          <button className="button--Metamask" onClick={connectMetamask}>
            Connect Metamask
          </button>
        ) : (
          <button className="button--Metamask-connected">
            Metamask connected
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
            <span className="calculator__result">Result: {result}</span>
          )}
        </div>

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
