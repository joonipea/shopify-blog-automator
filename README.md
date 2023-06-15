# Shopify Blog Automator

A simple tool to make good looking blogs on Shopify.

## Instructions:

1. Clone this repo using ```git clone https://github.com/joonipea/shopify-blog-automator.git```
2. run ```npm install``` in your terminal
3. replace the ```let imageQuery = ".your-image-container-class img";``` in ```./src/App.js``` with your image container class
4. run ```npm run start``` in your terminal
5. Paste your unformatted blog post into the left text area and click "Format"
6. Copy the formatted blog post from the right text area and paste it into Shopify's blog post editor

## Usage

Bold text wrapped in ```<p><b>Text</b></p>``` will be converted to ```<h3>Text<h3>```
Anchor tags wrapped in a ```<p>``` will be converted to the first or second image found in the link
