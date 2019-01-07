package com.royvanrijn.azspcs;

import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class PuzzleSolver {

    public static void main(String[] args) throws Exception {
        // Store the words we find here:
        Set<String> foundWords = new HashSet<>();

        // Read in the lexicon, the list of possible words:
        Set<String> lexicon = Files.readAllLines(FileSystems.getDefault().getPath(("Lexicon.txt"))) 
                .stream()                        // Open the file as a stream
                .map(line -> line.toUpperCase()) // Convert all the lines (one word per line) to uppercase
                .collect(Collectors.toSet());    // Store this in a list.

        String[] lines = ("TZKRAMONHSMARIONRDBU\n" +
                          "ARNOSTIASSTUNODJEOFN\n" +
                          "FMAMLAPCNNTPIKETYKXA\n" +
                          "UDHBISMUHBALTIGLCCSK\n" +
                          "HKLANTGERICHTEBBOAER\n" +
                          "YCHAVFCONTEAMSHUFFLE\n" +
                          "MIPXRETHNWSLIISIAEIS\n" +
                          "ZRSEKANFEIEUWUTLBQGW\n" +
                          "RTNPCIHBNLBRDOEDRGAO\n" +
                          "UANRIANAEMLOKLFSIETR\n" +
                          "UPEDMDGCODZUWEATCWCB\n" +
                          "TMOISREKIURBEGNREKGX\n" +
                          "UASROCSRPDWIUNPADOXJ\n" +
                          "JGRFTKIXMLENJRMAGDRU\n" +
                          "CNLBLMRSAAKNYFATMGCS\n" +
                          "GEOOYBAVKNNETXCKXOPT\n" +
                          "ZTVRUNLPVOENIREVLOWU\n" +
                          "COHRDBONSRHVEUDMURCS\n" +
                          "QIBEOVPAPPFACTORYDJO\n" +
                          "MRRLNYTRAPNALGCARIJB\n" +
                          "DIUEGIPHYJEROENAGRUK\n" +
                          "KSCNADINEELTHRANABIK")
                .split("\n");

        for(int y = 0; y < lines.length; y++) {
            for(int x = 0; x < lines[0].length(); x++) {
                for(int direction = 0; direction < 9; direction++) {
                    if(direction == 4) continue; // direction 4 is staying still, invalid.
                    int ty = y, tx = x;
                    String word = "" + lines[ty].charAt(tx);
                    while(tx > 0 && tx < lines[ty].length() - 1 && ty > 0 &&  ty < lines.length - 1) {
                        // Check if this is a word:
                        if(lexicon.contains(word += lines[ty += ((direction%3) - 1)].charAt(tx += ((direction/3) - 1)))) {
                            foundWords.add(word);
                        }
                    }
                }
            }
        }
        // Print the words:
        foundWords.stream().sorted().forEach(System.out::println);
    }
}
