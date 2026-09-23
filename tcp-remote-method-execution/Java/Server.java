import java.io.*;
import java.lang.reflect.*;
import java.net.*;

public class Server {

    public static void main(String[] args) {

        // Search classes folder 
        File classesFolder = new File("classes");
        int classCounter = 0;
        
        if (classesFolder.exists() && classesFolder.isDirectory()) {
            
            // Filter only files that ends with .java
            File[] files = classesFolder.listFiles((dir, name) -> name.endsWith(".java"));

            if (files != null) {
                classCounter = files.length;
                // Iterate over every file in folder
                for (File file: files) {
                    String className = file.getName().replace(".java", "");
                    System.out.println("Clase: '"+ className+"'encontrada en carpeta.");

                }
            } else {
                System.out.println("No se encontro la carpeta:"+ classesFolder);
            }
            System.out.println("Se encontraron "+ classCounter +" clases en total.\n");

        // Port declaration
        int PORT = 3000;

        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Servidor TCP escuchando en el puerto: " + PORT);

            // Run while connection is up
            while (true) {
                Socket socket = serverSocket.accept();
                System.out.println("\nUn cliente se ha conectado.");

                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                
                // Server receives request
                String request = in.readLine();
                if (request == null) continue;
                
                System.out.println("Recibiendo del cliente los siguientes datos: "+request);
                
                // Parse the stream
                try  {
                    String[] parts = request.split("\\|");
                    String className = parts[0];
                    String methodName = parts[1];
                    String[] types = parts[2].split(",");
                    String[] strValues = parts[3].split(",");

                    System.out.println("Clase: " + className);
                    System.out.println("Metodo: " + methodName);
                    System.out.println("Tipos: [" + String.join(", ", types) + "]");
                    System.out.println("Valores: [" + String.join(", ", strValues) + "]");

                    // Load the class dinamically from "classes" package
                    Class<?> clazz = Class.forName("classes." + className);
                    Object instance = clazz.getDeclaredConstructor().newInstance();

                    // IMPORTANT!

                    // Prepare the array that will contain data types and parsed values
                    Class<?>[] paramTypes = new Class<?>[types.length];
                    Object[] arguments = new Object[strValues.length];

                    for (int i=0; i<types.length; i++) {
                        switch (types[i]) {
                            case "int": 
                                paramTypes[i] = int.class;
                                arguments[i] = Integer.parseInt(strValues[i]);
                                break;
                            case "float":
                                paramTypes[i] = float.class;
                                arguments[i] = Float.parseFloat(strValues[i]);
                                break;
                            default: // default: string
                                paramTypes[i] = String.class;
                                arguments[i] = strValues[i];
                                break;
                            }
                        }

                        // IMPORTANT!

                        // Invoke method dinamically
                        Method method = clazz.getMethod(methodName, paramTypes);
                        Object result = method.invoke(instance, arguments);

                        // Send response to client
                        System.out.println("Resultado: " + result);
                        System.out.println("Enviando al cliente la siguiente respuesta: "+ result);
                        out.println(result.toString());
                        
                    // Error handling section
                    } catch (ClassNotFoundException e) {
                        out.println("Error: Clase no encontrada.");
                    } catch (NoSuchMethodException e) {
                        out.println("Error: Metodo no encontrado o tipo de datos incorrectos.");
                    } catch (Exception e) {
                        out.println("Error en la ejecucion: "+ e.getMessage());
                    } finally {
                        // End socket connection
                        socket.close();
                    }
                }
            } catch (IOException e) {
            e.printStackTrace();
            }
        }
    }
}