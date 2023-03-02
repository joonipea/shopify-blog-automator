import React from "react";
import { useRef } from "react";
import "./App.css";

const App = () => {
    const input = useRef();
    const output = useRef();
    let imageOrder = 0;
    const proxy = "https://fathomless-basin-04662.herokuapp.com/";
    const getImage = async (url) => {
        let image = {
            src: "",
            alt: ""
        }
        await fetch(proxy + url).then((res) => {
            return res.text()
        }).then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const imgSrc = doc.querySelectorAll("figure img")[imageOrder % 2].src.replace("480x","800x").split("?")[0];
            const imgAlt = doc.querySelectorAll("figure img")[imageOrder % 2].alt;
            console.log({doc, imgAlt, imgSrc});
            image.src = imgSrc;
            image.alt = imgAlt;
            imageOrder++;
            console.log(imageOrder);
        })
        return image;
    };

    const handleSubmit = async () => {
        const raw = input.current.value;
        const headered = raw.replace(/<p><b>/g, "<h3>").replace(/<\/b><\/p>/g, "</h3>").replace(/<p>\s<\/p>/g, "");
        const urls = [...headered.matchAll(/<p><a href="(.*?)">.*<\/p>/g)];
        console.log(urls);
        const formatted = async () => { 
            let formant = headered;
            for await (const url of urls) {
                const img = await getImage(url[1]);
                formant = formant.replace(/<p><a href="(.*?)">.*<\/p>/, `<div style="text-align: center"><a href="${url[1]}"><img style="float:none" alt="${img.alt}" src="${img.src}" /></a></div>`);
            }
            return formant;
        }
        output.current.value = await formatted();
    };
    return (
        <div className="app-container">
            <div className="text-holder">
                <label htmlFor="input">HTML Input</label>
                <textarea ref={input} id="input" />
            </div>
            <button onClick={handleSubmit}>Format</button>
            <div className="text-holder">
                <label htmlFor="output">HTML Output</label>
                <textarea ref={output} id="output" />
            </div>
        </div>
    );
}

export default App;