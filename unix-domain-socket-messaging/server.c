#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <signal.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>

#define SOCKET_FILE "./uds_endpoint.socket"
#define BUFFER_SIZE 1024

// Global so the SIGINT handler can close/clean it up on Ctrl+C
int server_fd;

void handle_sigint(int sig) {
    printf("\n[-] Apagando el servidor...\n");
    close(server_fd);
    unlink(SOCKET_FILE); // Delete socket file
    printf("[-] Servidor apagado correctamente.\n");
    exit(0);
}

int main() {
    int client_fd;
    struct sockaddr_un server_addr, client_addr;
    socklen_t client_len;
    char buffer[BUFFER_SIZE];

    // Handle Ctrl+C gracefully so the socket file always gets cleaned up
    signal(SIGINT, handle_sigint);

    // 1. Delete file if exist from previous instance
    unlink(SOCKET_FILE);

    // 2. Create socket conn
    // AF_UNIX for local comunication, SOCK_STREAM for tcp stream
    server_fd = socket(AF_UNIX, SOCK_STREAM, 0);
    if (server_fd == -1) {
        perror("[-] Error al crear el socket");
        exit(EXIT_FAILURE);
    }

    // 3. Config server address struct 
    memset(&server_addr, 0, sizeof(struct sockaddr_un)); // Clean memory
    server_addr.sun_family = AF_UNIX;
    strncpy(server_addr.sun_path, SOCKET_FILE, sizeof(server_addr.sun_path) - 1);

    // 4. Bind socket to physical file
    if (bind(server_fd, (struct sockaddr *) &server_addr, sizeof(struct sockaddr_un)) == -1) {
        perror("[-] Error en bind");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    // 5. Listen to connection (up to 5 on queue)
    if (listen(server_fd, 5) == -1) {
        perror("[-] Error en listen");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    printf("[*] Servidor C UDS iniciado.\n");
    printf("[*] Escuchando en el archivo: %s...\n", SOCKET_FILE);

    // Outer Loop: keep server running to accept multiple clients
    while(1) {
        // 6. Accept client connection
        client_len = sizeof(struct sockaddr_un);
        client_fd = accept(server_fd, (struct sockaddr *) &client_addr, &client_len);
        if (client_fd == -1) {
            perror("[-] Error en accept");
            continue;
        }

        printf("[+] Un cliente se ha conectado al Pipe\n");

        // Inner loop: keep reading messages from connected client
        while(1) {
            // 7. Read sent client data
            memset(buffer, 0, BUFFER_SIZE); // Clean buffer
            ssize_t bytes_read = read(client_fd, buffer, BUFFER_SIZE - 1);
            
            if (bytes_read <= 0) {
                printf("[-] El cliente se desconectó abruptamente.\n");
                break; // Break inner loop
            }

            // Clean newline char if exists
            buffer[strcspn(buffer, "\n")] = 0;

            // Check exit condition (case-insensitive, matches the Python version)
            if (strcasecmp(buffer, "SALIR") == 0) {
                printf("[-] El cliente cerró la conexión mediante comando SALIR.\n");
                break; // Break inner loop
            }

            printf("[Cliente dice]: '%s'\n", buffer);

            // Respond to client dynamically
            char response[BUFFER_SIZE + 50];
            snprintf(response, sizeof(response), "Mensaje '%s' procesado por el servidor.", buffer);
            write(client_fd, response, strlen(response));
        }

        // Close current client
        close(client_fd);
        printf("[*] Esperando a un nuevo cliente...\n");
    }

    return 0;
}