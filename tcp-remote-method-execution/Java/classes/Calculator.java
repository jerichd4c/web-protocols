package classes;

public class Calculator {
    public int add(int a, int b) {return a +b; }
    public int subtract(int a, int b) { return a - b; }
    public String divide(int a, int b) {
        return (b != 0) ? String.valueOf((float) a / b) : "Error: División por cero";
    }
}