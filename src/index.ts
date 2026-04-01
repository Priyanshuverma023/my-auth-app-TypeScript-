import {createServer} from 'node:http'
import {createApplication} from './app'

async function main() {
  try {
    const server = createServer(createApplication())
    const PORT: number = 8080

    server.listen(PORT,() => {
      console.log(`Server is running on PORT ${PORT}`)
    })
  } catch(error) {
    console.error(`Error starting server`)
    throw error
  }
}

main()