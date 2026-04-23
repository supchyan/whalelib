import fs from "fs"
import path from "path"

/**
 * Contains methods to bundle whalelib.
 */
export class LibBuilder {
    /**
     * Bundles whalelib.
     */
    static build() {
        const buildPath     = "./.build";
        const testsPath     = "./tests";
        const srcPath       = "./src";
        const commonPath    = "./src/common";

        const bundleName = "whalelib.js";
        const testsIncludeFlag = "-ti";
        
        // stores content to write into a bundle file
        var buffer = "";

        console.clear();

        console.log(`[!!!] Bundling ${bundleName}\n`);

        if (!fs.existsSync(srcPath)) {
            return console.error("[!!!] Source directory cannot be found. Make sure you run this script under root directory of the whalelib's source.\n")
        }

        if (!fs.existsSync(buildPath)) {
            fs.mkdirSync(buildPath);
        }
        
        console.log(`Reading ${commonPath}`);
        console.log(`--------------------`);

        // --- BUNDLERS SECTION ---
        fs.readdirSync(commonPath).forEach(file => {
            buffer += `${fs.readFileSync(`${commonPath}/${file}`)}\n`;
            console.log(file);
        });

        console.log();
        // --- END OF BUNDLERS ---

        const destination       = `${buildPath}/${bundleName}`;
        const cloneDestination  = `${testsPath}/${bundleName}`;
        
        fs.writeFileSync(destination, buffer);

        if (fs.existsSync(destination)) {
            console.log(`Bundle saved to ${path.resolve(destination)}`);
        }

        if (process.argv.includes(testsIncludeFlag) && fs.existsSync(testsPath)) {
            fs.copyFileSync(destination, cloneDestination);

            if (fs.existsSync(cloneDestination)) {
                console.log(`Bundle saved to ${path.resolve(cloneDestination)} [${testsIncludeFlag}]`);
            }
        }
    }
}