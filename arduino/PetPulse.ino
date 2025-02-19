// Last update: 2025-02-19 20:00:00
// This code was developed for the ESP32 Devkit V1 microcontroller and the MAX30105 sensor.

// Includes
// ----------------------------------------------------------------------------
#include "Arduino.h"
#include "BluetoothSerial.h"
#include <Wire.h>
#include "MAX30105.h"   // Biblioteca MAX3010x
#include "heartRate.h"  // Algoritmo de cálculo da frequência cardíaca

// Constants
// ----------------------------------------------------------------------------
#define QDS_QUEUE_SIZE 64
#define QDR_QUEUE_SIZE 64
#define LED_BUILTIN 2

// Sensor Configuration
MAX30105 particleSensor;
const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute;
int beatAvg;

// Typedefs
// ----------------------------------------------------------------------------
typedef struct {
  uint8_t val;
} DSPacket;

typedef struct {
  uint8_t val;
} DRPacket;

// Variables
// ----------------------------------------------------------------------------
TaskHandle_t TDataSender = NULL;
TaskHandle_t TDataReceiver = NULL;
TaskHandle_t TUpdate = NULL;

static xQueueHandle qDataSend = NULL;
static xQueueHandle qDataRec = NULL;

BluetoothSerial SerialBT;

// Function Prototypes
// ----------------------------------------------------------------------------
void DataSender(void *pvParameters);
void DataReceiver(void *pvParameters);
void Update(void *pvParameters);

// Setup
// ----------------------------------------------------------------------------
void setup() {
  setCpuFrequencyMhz(240);

  // Initialize LED
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  // Initialize Serial and Bluetooth
  Serial.begin(115200);
  SerialBT.begin("PetPulse");
  Serial.println("Bluetooth Initialized");

  // Initialize MAX30102 Sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 not found. Please check wiring.");
    while (1);
  }
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  Serial.println("MAX30102 Initialized");

  // Create Queues
  qDataSend = xQueueCreate(QDS_QUEUE_SIZE, sizeof(DSPacket));
  qDataRec = xQueueCreate(QDR_QUEUE_SIZE, sizeof(DRPacket));

  // Create Tasks
  xTaskCreatePinnedToCore(DataSender, "DataSender", 4096, NULL, 1, &TDataSender, 0);
  xTaskCreatePinnedToCore(DataReceiver, "DataReceiver", 4096, NULL, 1, &TDataReceiver, 0);
  xTaskCreatePinnedToCore(Update, "Update", 4096, NULL, 1, &TUpdate, 1);

  digitalWrite(LED_BUILTIN, HIGH);
  vTaskDelete(NULL); // Terminate setup task
}

void loop() {
  // Empty. Tasks are running.
}

// Tasks
// ----------------------------------------------------------------------------
void DataSender(void *pvParameters) {
  DSPacket dsPacket;
  String str;
  for (;;) {
    if (xQueueReceive(qDataSend, &dsPacket, pdMS_TO_TICKS(10)) == pdPASS) {
      str = String(dsPacket.val) + " \n";
      SerialBT.write((const uint8_t *)str.c_str(), str.length());

    }
  }
}
const TickType_t xSendDelay = pdMS_TO_TICKS(100);

void DataReceiver(void *pvParameters) {
  DRPacket drPacket;
  for (;;) {
    if (SerialBT.available()) {
      int dataBT = SerialBT.read();
      if (dataBT != -1) {
        drPacket.val = (uint8_t)dataBT;
        xQueueSend(qDataRec, &drPacket, 0);
      }
    }
    vTaskDelay(xSendDelay);
  }
}

void Update(void *pvParameters) {
  long irValue;
  DSPacket dsPacket;
  for (;;) {
    irValue = particleSensor.getIR();
    if (irValue > 7000) {
      Serial.print("IR Value: ");
      Serial.println(irValue);

      if (checkForBeat(irValue) == false) {

        long delta = millis() - lastBeat;
        lastBeat = millis();
        beatsPerMinute = 60 / (delta / 1000.0);

        Serial.print("delta: ");
        Serial.println(delta);

        Serial.print("lastBeat: ");
        Serial.println(lastBeat);

        Serial.print("Beats per minute: ");
        Serial.println(beatsPerMinute);

        if (beatsPerMinute < 255 && beatsPerMinute > 20) {
          rates[rateSpot++] = (byte)beatsPerMinute;
          rateSpot %= RATE_SIZE;

          beatAvg = 0; 

          Serial.print("Debug 2: ");

          for (byte i = 0; i < RATE_SIZE; i++)
            beatAvg += rates[i];
          beatAvg /= RATE_SIZE;

          Serial.print(beatAvg);
          Serial.println(" BPM");

          dsPacket.val = beatAvg;
          xQueueSend(qDataSend, &dsPacket, 0);
        }
      }
    }if (irValue < 7000) {
      beatAvg = 0;
      Serial.println("Please place your finger on the sensor.");
    }
    vTaskDelay(pdMS_TO_TICKS(900));
  }
}