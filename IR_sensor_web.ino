#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Replace with your network credentials
const char* ssid = "Saksham";
const char* password = "machayenge4";

// MQTT Broker configuration
const char* mqttServer = "broker.mqttdashboard.com"; // Replace with your MQTT broker IP or hostname
const int mqttPort = 1883;
const char* mqttTopic = "ir_t_s"; // Replace with the desired MQTT topic

// Create an instance of the WiFiClient class
WiFiClient espClient;

// Create an instance of the PubSubClient class
PubSubClient client(espClient);

// IR sensor pin
const int irSensorPin = 4; // Replace with the actual pin number connected to the IR sensor

void setup() {
  // Start Serial communication
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Set MQTT server and callback function
  client.setServer(mqttServer, mqttPort);

  // Set IR sensor pin as input
  pinMode(irSensorPin, INPUT);
}

void loop() {
  // Reconnect to MQTT if necessary
  if (!client.connected()) {
    reconnect();
  }

  // Read IR sensor status
  int irSensorValue = digitalRead(irSensorPin);
  String status = (irSensorValue == HIGH) ? "Motion Detected" : "No Motion";

  // Publish the status to the MQTT topic
  publishStatus(status);

  delay(5000);
}

void reconnect() {
  // Loop until connected to MQTT broker
  while (!client.connected()) {
    Serial.println("Connecting to MQTT broker...");
    if (client.connect("ESP32Client")) {
      Serial.println("Connected to MQTT broker");

      // Subscribe to desired topics if needed
      // client.subscribe("topic/subtopic");

    } else {
      Serial.print("Failed to connect to MQTT broker, retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void publishStatus(String status) {
  // Create a JSON object
  StaticJsonDocument<64> jsonDoc;
  
  // Set the "status" field in the JSON object
  jsonDoc["status"] = status;

  // Serialize the JSON object to a char array
  char jsonMessage[64];
  serializeJson(jsonDoc, jsonMessage);

  // Publish the JSON message to the MQTT topic
  client.publish(mqttTopic, jsonMessage);
  Serial.println("Published IR sensor status: " + status);
}
