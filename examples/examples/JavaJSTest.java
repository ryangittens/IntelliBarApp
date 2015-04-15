import java.applet.Applet;

import netscape.javascript.*;

public class JavaJSTest extends Applet {
    private int numPassed;
    private int numFailed;

    public void start() {
        testFunctionCall();
        testFieldAccess();
        testArrayAccess();
        System.out.println("" + numPassed + " tests passed, " + numFailed + " tests failed");
    }

    private void testFunctionCall() {
        try {
            System.out.println("testFunctionCall: test started");
            JSObject window = JSObject.getWindow(this);
            System.out.println("Calling JavaScript getString();");
            String res = (String) window.eval("getString();");
            System.out.println("Got string from JavaScript: \"" + res + "\"");
            if (!res.equals("Hello, world!")) {
                throw new RuntimeException("string value did not match expected value");
            }
            Number num = (Number) window.eval("getNumber()");
            System.out.println("Got number from JavaScript: " + num);
            if (num.intValue() != 5) {
                throw new RuntimeException("number value did not match expected value");
            }
            System.out.println("testFunctionCall: test passed.");
            ++numPassed;
        } catch (JSException e) {
            e.printStackTrace();
            System.out.println("TEST FAILED");
            ++numFailed;
        } catch (Exception e2) {
            e2.printStackTrace();
            System.out.println("TEST FAILED");
            ++numFailed;
        }
    }

    private void testFieldAccess() {
        try {
            System.out.println("testFieldAccess: test started");
            JSObject window = JSObject.getWindow(this);
            System.out.println("Calling JavaScript new cities();");
            JSObject res = (JSObject) window.eval("new cities();");
            System.out.println("Finished calling JavaScript");
            printCities(res);
            if (!((String) res.getMember("b")).equals("Belgrade")) {
                throw new RuntimeException("TEST FAILED");
            }
            res.setMember("b", "Belfast");
            System.out.println("Set cities.b to Belfast");
            printCities(res);
            if (!res.getMember("b").equals("Belfast")) {
                throw new RuntimeException("TEST FAILED");
            }
            System.out.println("Deleting cities.b");
            res.removeMember("b");
            printCities(res);
            try {
                res.getMember("b");
                throw new RuntimeException("TEST FAILED");
            } catch (JSException e) {
                // Member should not be present any more
            }
            System.out.println("testFieldAccess: test passed.");
            numPassed++;
        } catch (JSException e) {
            e.printStackTrace();
            numFailed++;
        } catch (Exception e2) {
            e2.printStackTrace();
            numFailed++;
        }
    }

    private void printCities(JSObject cities) {
        printCity(cities, "a");
        printCity(cities, "b");
        printCity(cities, "c");
    }

    private void printCity(JSObject cities, String which) {
        System.out.print("cities." + which + " = ");
        try {
            System.out.println(cities.getMember(which));
        } catch (JSException e) {
            System.out.println("[undefined]");
        }
    }

    private void testArrayAccess() {
        try {
            System.out.println("testArrayAccess: test started");
            JSObject window = JSObject.getWindow(this);
            System.out.println("Calling JavaScript getTestArray();");
            JSObject res = (JSObject) window.eval("getTestArray();");
            System.out.println("Finished calling JavaScript getTestArray();");
            System.out.println("testArray[0] = " + res.getSlot(0));
            System.out.println("testArray[1] = " + res.getSlot(1));
            if (!((String) res.getSlot(0)).equals("foo") ||
                !((String) res.getSlot(1)).equals("bar")) {
                throw new RuntimeException("array contents didn't match expected values");
            }
            System.out.println("Trying to redefine testArray[1]");
            res.setSlot(1, "baz");
            System.out.println("testArray[1] = " + res.getSlot(1));
            if (!((String) res.getSlot(1)).equals("baz")) {
                throw new RuntimeException("failed to redefine array element");
            }
            System.out.println("Trying to define testArray[2]");
            res.setSlot(2, "qux");
            System.out.println("testArray[2] = " + res.getSlot(2));
            if (!((String) res.getSlot(2)).equals("qux")) {
                throw new RuntimeException("failed to correctly define new array element");
            }
            System.out.println("testArrayAccess: test passed.");
            ++numPassed;
        } catch (JSException e) {
            e.printStackTrace();
            System.out.println("testArrayAccess: TEST FAILED");
            ++numFailed;
        } catch (Exception e2) {
            e2.printStackTrace();
            System.out.println("testArrayAccess: TEST FAILED");
            ++numFailed;
        }
    }
}
