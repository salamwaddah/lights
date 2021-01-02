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
    try {
      connection = await io.device({
        address,
        token,
      })
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }

  connections[address] = connection

  return connection;
}

/**
 * Checks if a light is on then changes the color
 *
 * @param color
 * @returns {Promise<void>}
 */
async function changeColor(color) {
  console.log(`Changing color to: ${color}`)

  for (const light of lights) {
    try {
      const connection = await connect(light.ip, light.token);

      if (await connection.power()) {
        connection.color(color)
      } else {
        console.error(`Couldn't change light color, make sure it's turned on`)
      }

    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }
}

app.get('/lights/on', async (req, res) => {
  for (const light of lights) {
    try {
      const connection = await connect(light.ip, light.token)

      console.info(`Light ${light.ip} is ON`)
      connection.setPower(true)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }

  res.status(200).send('Lights on')
});

app.get('/lights/off', async (req, res) => {
  for (const light of lights) {
    try {
      const connection = await connect(light.ip, light.token)

      console.info(`Light ${light.ip} is OFF`)
      connection.setPower(false)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
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

  await changeColor(colors[selectedColorIndex])

  res.status(200).send(`Color changed to ${colors[selectedColorIndex]}`)
});

app.get('/lights/color-prev', async (req, res) => {
  // Determine which color is previous
  if (selectedColorIndex > 0) {
    selectedColorIndex--
  } else {
    selectedColorIndex = colorsCount;
  }

  await changeColor(colors[selectedColorIndex])

  res.status(200).send(`Color changed to ${colors[selectedColorIndex]}`)
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
