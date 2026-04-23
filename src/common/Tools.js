/**
 * Contains QoL to improve development process.
 */
class Tools {
    /**
     * Applies several styles to a <body> tag.
     */
    static useCustomBody() {
        document.body.setAttribute("style", `/* modified by whale-lib */
            padding: 0;
            margin: 0;
            
            width: 100vw;
            height: 100vh;

            overflow: hidden;
        `);
    }
    /**
     * Evaluates javascript by path specified.
     * @param {*} path path to javascript file to evaluate.
     */
    static eval(path) {
        fetch(path).then(res => {
            if (!res.ok) {
                return;
            }

            res.text().then(code => {
                eval(code);
            });
        });
    }
}