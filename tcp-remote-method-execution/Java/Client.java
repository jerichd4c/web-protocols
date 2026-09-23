import java.io.*;
import java.net.*;
import java.util.Scanner;

public class Client {
    private static final String HOST = "127.0.0.1";
    private static final int PORT = 3000;
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        showMainMenu();
    }

    // Aux function for user menu

    private static void showMainMenu() {
        while (true) {
            System.out.println("\nSelecciona una clase\n");
            System.out.println("1. Calculadora");
            System.out.println("2. Modificador de texto");
            System.out.println("3. Conversor");
            System.out.println("4. Salir\n");
            System.out.print("Opción: ");
            
            String option = scanner.nextLine();

            switch (option) {
                case "1": calculatorMenu(); break;
                case "2": textModifierMenu(); break;
                case "3": currencyConverterMenu(); break;
                case "4": 
                    System.out.println("Saliendo...");
                    System.exit(0);
                default: 
                    System.out.println("Opción invalida.");
            }
        }
    }

    // Calculator menu method
    private static void calculatorMenu() {
        System.out.println("\nSelecciona una operacion (Calculadora)\n");
        System.out.println("1. Sumar");
        System.out.println("2. Restar");
        System.out.println("3. Dividir");
        System.out.println("4. Volver\n");
        System.out.print("Opcion: ");
        
        String option = scanner.nextLine();
        if (option.equals("4")) return;

        String method = "";
        switch (option) {
            case "1": method = "add"; break;
            case "2": method = "subtract"; break;
            case "3": method = "divide"; break;
            default:
                System.out.println("Opción inválida.");
                return;
        }

        System.out.println("Ingrese primer numero: ");
        String num1 = scanner.nextLine();
        System.out.println("Ingrese segundo numero: ");
        String num2 = scanner.nextLine();

        sendStream("Calculator", method, new String[]{num1, num2});
    } 

    // Text modifier menu method
    private static void textModifierMenu() {
        System.out.println("\nSelecciona una operación (Modificador de Texto)\n");
        System.out.println("1. Convertir a Mayusculas");
        System.out.println("2. Convertir A Minusculas");
        System.out.println("3. Contar Caracteres");
        System.out.println("4. Volver\n");
        System.out.print("Opcion: ");
        
        String option = scanner.nextLine();
        if (option.equals("4")) return;

        String method = "";
        switch (option) {
            case "1": method = "upperCase"; break;
            case "2": method = "lowerCase"; break;
            case "3": method = "countCharacters"; break;
            default: return;
        }

        System.out.println("Ingrese el texto: ");
        String text = scanner.nextLine();

        sendStream("TextModifier", method, new String[]{text});
    }

    // Currency converter menu method
    private static void currencyConverterMenu() {
        System.out.println("\nSelecciona una operacion (Conversor de moneda)\n");
        System.out.println("1. Dolares a Euros");
        System.out.println("2. Bolivares a Dolares");
        System.out.println("3. Volver\n");
        System.out.print("Opcion: ");
        
        String option = scanner.nextLine();
        if (option.equals("4")) return;

        String method = "";
        switch (option) {
            case "1": method = "dollarToEuro"; break;
            case "2": method = "bolivarToDollar"; break;
            default: return;
        }

        System.out.println("Ingrese el valor a convertir: ");
        String valor = scanner.nextLine();

        sendStream("CurrencyConverter", method, new String[]{valor});
    }

    // Send stream method main logic
    private static void sendStream(String className, String method, String[] values) {
        String[] types = detectTypes(values);

        String strTypes = String.join(",", types);
        String strValues = String.join(",", values);

        String stream = className + "|" + method + "|" + strTypes + "|" + strValues;
        System.out.println("Enviando al servidor los siguientes datos: " + stream);

        try (Socket socket = new Socket (HOST, PORT); 
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

            // Send stream to server side
            out.println(stream);

            // Receive response
            String response = in.readLine();
            System.out.println("Resultado: " + response);

            } catch (IOException e) {
                System.out.println("Error de conexión con el servidor: " + e.getMessage());
            }
        }
        
    private static String[] detectTypes(String[] values) {
        String[] types = new String[values.length];
        for (int i = 0; i < values.length; i++) {
            String val = values[i].trim();
            if (val.isEmpty()) {
                types[i] = "string" ;
                continue;
            }

            try {
                Integer.parseInt(val);
                types[i] = "int";
            } catch (NumberFormatException e1) {
                try {
                    Float.parseFloat(val);
                    types[i] = "float";
                } catch (NumberFormatException e2) {
                    types[i] = "String";
                }
            }
        } 
        return types;
    }
}