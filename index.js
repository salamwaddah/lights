import express from 'express';
import io from 'mijia-io';

const app = express();

/**
 * Instead of connecting to device every time, we will store the connection here if it was successful
 * The structure for each device will be as follows
 * {
 *  'ip.address': null | Promise,
 *  'ip.address': null | Promise,
 * }
 */
const connections = {}

/**
 * Add your light IP address and token here
 *
 * @type {{ip: string, token: string}[]}
 */
const lights = [
  {
    ip: '',
    token: '',
  },
];

// List of HEX colors
const colors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FFFFFF',
]

// Variables used to determine which color is next
let selectedColorIndex = 0;
let colorsCount = colors.length - 1

/**
 * This helper will connect to device using token
 * and then stores it in the connections for later use
 *
 * @param address
 * @param token
 * @returns {Promise<*>}
 */
async function connect(address, token) {
  console.info(`Connecting to light ${address}`)
  let connection = connections[address];

  if (!connection) {
    console.log(`No connection: adding new for ${address}`)
    connection = await io.device({
      address,
      token,
    })
  }

  connections[address] = connection

  return connection;
}

/**
 * Checks if a light is on then changes the color
 *
 * @param connection
 * @param color
 * @returns {Promise<void>}
 */
async function changeColor(connection, color) {
  if (await connection.power()) {
    connection.color(color)
  } else {
    console.error(`Couldn't change color, make sure ${light.ip} is turned on`)
  }
}

app.get('/lights/on', async (req, res) => {
  for (const light of lights) {
    const connection = await connect(light.ip, light.token)

    console.info(`Light ${light.ip} is ON`)
    connection.setPower(true)
  }

  res.status(200).send('Lights on')
});

app.get('/lights/off', async (req, res) => {
  for (const light of lights) {
    const connection = await connect(light.ip, light.token)

    console.info(`Light ${light.ip} is OFF`)
    connection.setPower(false)
  }

  res.status(200).send('Lights off')
});

app.get('/lights/color-next', async (req, res) => {
  // Determine which color is next
  if (selectedColorIndex < colorsCount) {
    selectedColorIndex++
  } else {
    selectedColorIndex = 0;
  }

  const color = colors[selectedColorIndex]
  console.log(`Changing color to: ${color}`)

  for (const light of lights) {
    await changeColor(
      await connect(light.ip, light.token),
      color
    )
  }

  res.status(200).send(`Color changed to ${color}`)
});

app.get('/lights/color-prev', async (req, res) => {
  // Determine which color is previous
  if (selectedColorIndex > 0) {
    selectedColorIndex--
  } else {
    selectedColorIndex = colorsCount;
  }

  const color = colors[selectedColorIndex]
  console.log(`Changing color to: ${color}`)

  for (const light of lights) {
    await changeColor(
      await connect(light.ip, light.token),
      color
    )
  }

  res.status(200).send(`Color changed to ${color}`)
});

app.get('/lights/brightness-up', async (req, res) => {
  for (const light of lights) {
    const connection = await connect(light.ip, light.token);
    console.info(`TODO: change brightness up`)
  }

  res.status(200).send(`TODO: change brightness up`)
});

app.get('/lights/brightness-down', async (req, res) => {
  for (const light of lights) {
    const connection = await connect(light.ip, light.token);
    console.info(`TODO: change brightness down`)
  }

  res.status(200).send(`TODO: change brightness down`)
});

const PORT = 5000;
app.listen(PORT, () => {
  console.info(`Serving on: http://0.0.0.0:${PORT}`)
  return '0.0.0.0';
});
