
import config from './config'

import { start as server } from './server'

import * as zmq from 'zeromq'

import { publish } from 'rabbi'

export async function start() {

  if (config.get('http_api_enabled')) {

    server();

  }

  const sock = new zmq.Subscriber()

  sock.connect(process.env.btc_core_zmq_socket)
  sock.subscribe("hashblock")

  for await (const [topic, msg] of sock) {
    console.log("received a message related to:", topic, "containing message:", msg)

    publish('anypay', 'btc.block.hash', msg)

    console.log('messaged published to amqp')
  }

}

if (require.main === module) {

  start()

}
