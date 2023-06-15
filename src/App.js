import React from "react";
import { useRef } from "react";
import "./App.css";

const App = () => {
    const input = useRef();
    const output = useRef();
    let imageOrder = 0;
    let imageQuery = ".your-image-container-class img"; //example: ".product-gallery__item figure img"
    const getImage = async (url) => {
        let image = {
            src: "",
            alt: ""
        }
        console.log(url);
        await fetch(url).then((res) => {
            return res.text()
        }).then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const imgSrc = doc.querySelectorAll(imageQuery)[imageOrder % 2].src.replace("480x","800x").split("?")[0];
            const imgAlt = doc.querySelectorAll(imageQuery)[imageOrder % 2].alt;
            console.log({doc, imgAlt, imgSrc});
            image.src = imgSrc;
            image.alt = imgAlt;
            imageOrder++;
        })
        return image;
    };

    const handleSubmit = async () => {
        const raw = input.current.value;
        //replace bolded text with header
        const headered = raw.replace(/<p><b>/g, "<h3>").replace(/<\/b><\/p>/g, "</h3>").replace(/<p>\s<\/p>/g, ""); 
        //find all links and push them to an array
        const urls = [...headered.matchAll(/<p><a href="(.*?)">.*<\/p>/g)];
        const formatted = async () => { 
            let formant = headered;
            for await (const url of urls) {
                const img = await getImage(url[1]);
                // replace link with image wrapped in anchor tag
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