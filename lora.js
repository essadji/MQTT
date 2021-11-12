const mqtt = require('mqtt')

// const host = 'broker.emqx.io'
const host = 'eu1.cloud.thethings.network'
const port = '1883'
const clientId1 = `mqtt_${Math.random().toString(16).slice(3)}`
const clientId2 = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client1 = mqtt.connect(connectUrl, {
    clientId1,
    clean: true,
    connectTimeout: 4000,
    username: 'demo-lora-embedded-2021@ttn',
    password: 'NNSXS.IKZXQ4IU3FQSW33O6ATT2LF27YVTFMJZINNQWAQ.L72CTD5WKSB52I7N6PNIFJPQT7THLPP3AFZNTU7GAQZ4AWNZABQA',
    reconnectPeriod: 1000,
})
const client2 = mqtt.connect(connectUrl, {
    clientId2,
    clean: true,
    connectTimeout: 4000,
    username: 'demo-lora-embedded-2021@ttn',
    password: 'NNSXS.IKZXQ4IU3FQSW33O6ATT2LF27YVTFMJZINNQWAQ.L72CTD5WKSB52I7N6PNIFJPQT7THLPP3AFZNTU7GAQZ4AWNZABQA',
    reconnectPeriod: 1000,
})

client1.on('connect', () => {
    console.log(`Client 1 connected with mqtt ID ${clientId1}`)
    client1.subscribe(['v3/+/devices/+/up'], () => {
        console.log(`Subscribed to test topic`)
    })
    // client1.publish(topic, 'MQTT test', { qos: 0, retain: false }, (error) => {
    //     if (error) {
    //         console.error(error)
    //     }
    // })
})
client1.on('message', (topic, payload) => {
    console.log('Message received by client 1: ', topic, JSON.parse(payload.toString()))
})

client2.on('connect', () => {
    console.log(`Client 2 connected with mqtt ID ${clientId2}`)
    client2.subscribe(['#'], () => {
        console.log(`Subscribed to topic #`)
    })
})
client2.on('message', (topic, payload) => {
    console.log('Message received by client 2: ', topic, JSON.parse(payload.toString()))
})