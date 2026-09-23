import asyncio
import websockets
import json

# Handle client connections
async def handle_client(websocket):
    try: 
        # Websocket keeps listening for messages from the client
        async for message in websocket:
            # msj 2: Execute in terminal when message is received
            print("msj 2: Hola mundo recibido (Server)")

            # msj 3: Execute a confirmation message before sending the response to the client
            print("msj 3: Enviando mensaje de confirmación al cliente (Server)")

            # Prepare response back to the client
            response = json.dumps({"mensaje": "Hola mundo recibido (Server)"})
            await websocket.send(response)

    except websockets.exceptions.ConnectionClosed:
        print("Cliente desconectado")

async def main():
    # Start the WebSocket server
    async with websockets.serve(handle_client, "localhost", 8000):
        print("Servidor WebSocket iniciado en ws://localhost:8000")
        #Keeps the server running indefinitely
        await asyncio.Future() 

if __name__ == "__main__":
    asyncio.run(main())
