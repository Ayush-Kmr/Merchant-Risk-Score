import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import UpdatePassword from "./UpdatePassword";
import "./RiskScoreBoard.css";
import axios from "axios"; // Make sure to install axios

const RiskScoreBoard = () => {
  const chartRef = useRef(null);
  const [score, setScore] = useState(85); // Initial score
  const [details, setDetails] = useState({});
  const chartInstanceRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/merchant/risk-score",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the JWT token in the Authorization header
            },
          }
        ); // Your GET API
        setScore(response.data.riskScore.score); // Assuming the response has a 'riskScore.score' property
        setDetails(response.data.riskScore.details);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Fetch data every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [score, 100 - score],
            backgroundColor: ["#45a29e", "#1f2833"],
            borderWidth: 0,
            cutout: "80%",
            rotation: -90,
            circumference: 180,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          arc: { borderRadius: 5 },
        },
      },
    });

    rotateNeedle(score);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [score]);

  const rotateNeedle = (score) => {
    const angle = (score / 100) * 180 - 90;
    document.getElementById("needle").style.transform = `rotate(${angle}deg)`;
  };

  const handleUpdatePassword = (oldPassword, newPassword) => {
    console.log("Updating password:", { oldPassword, newPassword });
    // Implement your update password logic here
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Security Risk Score</h1>
        <p>Monitoring your security posture at a glance!</p>
      </div>

      <div className="chart-container">
        <canvas ref={chartRef} id="gaugeChart"></canvas>
        <div className="score-label" id="scoreLabel">
          {score}
        </div>
        <div className="needle" id="needle"></div>
      </div>

      <div className="cards-container">
        {Object.entries(details).map(([key, value]) => {
          // Determine if risk is detected
          let detected = false;
          let content = "";
          let className = "green";
          let riskType = "Risk Impact: NONE";
          let nextSteps = "";
          let title = "";
          let subTitle='';

          if (key === "passwordRisk") {
            detected = value.score > 0; // Risk detected if score > 0
            content = `Status: Your Password Was Updated ${value.age.toFixed(
              2
            )} Days Ago`;
            title = "Password Age";
            subTitle=`${value.age.toFixed(2)} Days Ago`;
            if (value.age > 180) {
              riskType = "Risk Impact: CRITICAL";
              nextSteps = `Next Steps: Please Update Your Password Immediately`;
            } else if (value.age > 90) {
              riskType = "Risk Impact: HIGH";
              nextSteps = `Next Steps: Please Update Your Password as soon as possible`;
            }
            if (!detected) {
              nextSteps = `Next Steps: No immediate action needed`;
            }
          } else if (key === "twoFactorAuthRisk") {
            detected = !value.twoFactorAuthEnabled; // Risk detected if 2FA is not enabled
            content = `Status: 2FA Is ${
              value.twoFactorAuthEnabled ? "ENABLED" : "DISABLED"
            }`;
            title = "2FA Status";
            if (!detected) {
              nextSteps = `Next Steps: Keep 2FA enabled for enhanced security`;
              subTitle=`2FA ENABLED`;
            } else {
              nextSteps = `Next Steps: Please enable your 2FA for enhanced secuirty`;
              subTitle=`2FA DISABLED`;
            }
          } else if (key === "apiKeyRisk") {
            detected = value.score > 0; // Risk detected if score > 0
            // content = `Status: API Key Was Rotated ${value.age.toFixed(2)} Days Ago`;
            title = "API Key Rotation";
            // subTitle=`${value.age.toFixed(2)} Days Ago`;
            if (value.age > 180) {
              riskType = "Risk Impact: CRITICAL";
              nextSteps = `Next Steps:
                           Immediate Action: Rotate API key to mitigate risks
                           Alert: Notify the security team for investigation
                           Impact: Key rotation ensures compromised keys become invalid`;
            } else if (value.age > 90) {
              riskType = "Risk Impact: HIGH";
              nextSteps = `Next Steps:
                           Recommendation: Rotate API key to mitigate risks
                           Impact: Key rotation ensures compromised keys become invalid`;
            } else {
              nextSteps = `Next Steps: No immediate action needed`;
            }
          } else if (key === "apiKeyLeakRisk") {
            detected = value.leaked; // Risk detected if leaked is true
            content = `${
              value.leaked
                ? "Status: Your API Keys Are Leaked Publicly"
                : "Status: No API Keys Leaked"
            }`;
            title = "API Key Leak Detection";
            if (value.leaked) {
              riskType = "Risk Impact: CRITICAL";
              subTitle=`NO API KEY LEAKED`;
              nextSteps = `Next Steps: 
                           Immediate Action: Rotate your API keys
                           Alert: Notify the security team for investigation`;
            } else {
              nextSteps = `Next Steps: No immediate action needed`;
              subTitle=`NO API KEY LEAKED`;
            }
          }

          // Update className based on detection
          if (detected) {
            className = "red";
          }

          return (
            <div key={key} className={`card ${className}`}>
              <div classNamre="card-title">{title}</div>
              <div className="card-content">
                <div
                  className="alerts-container"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="visible-text">{subTitle}</div>
                  <div className="tooltip">
                    {content}
                    <br />
                    {riskType}
                    <br />
                    {nextSteps}
                  </div>
                </div>

                {(key === "passwordRisk" || key === "Weak Password") &&
                  detected && (
                    <div
                      className="update-password-link"
                      onClick={() => setModalVisible(true)}
                    >
                      Update Password
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {modalVisible && (
        <UpdatePassword
          onClose={() => setModalVisible(false)}
          onUpdate={handleUpdatePassword}
        />
      )}
    </div>
  );
};

export default RiskScoreBoard;
