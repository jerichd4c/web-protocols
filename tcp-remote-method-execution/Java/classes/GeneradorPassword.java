package classes;

import java.util.Random;

public class GeneradorPassword {
    
    public String generar(int longitud) {
        if (longitud <= 0) {
            return "Error: La longitud debe ser mayor a 0";
        }
        
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        Random rnd = new Random();
        StringBuilder password = new StringBuilder();
        
        for (int i = 0; i < longitud; i++) {
            int index = rnd.nextInt(caracteres.length());
            password.append(caracteres.charAt(index));
        }
        
        return password.toString();
    }
}
