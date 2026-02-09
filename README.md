# Background Remover App

A simple web application that removes image backgrounds using **Python**, **Flask**, and the **rembg** library.  
Users can upload an image and download the background-removed result.

---

## Features

- Upload images (PNG, JPG, JPEG)
- Automatic background removal
- Preview and download output image
- Clean and simple UI
- Runs locally using Flask

---

## Tech Stack

- Backend: Python, Flask
- Image Processing: rembg (U-2-Net)
- Frontend: HTML, CSS, JavaScript

---

## Requirements

- Python 3.7 or higher
- Flask
- rembg
- Pillow

Install dependencies:

```bash
pip install -r requirements.txt
```

## Project Structure
```
background-remover-app/
├── app.py
├── requirements.txt
├── static/
│   ├── css/
│   └── js/
└── templates/
    └── index.html
```

## How to Run

## Clone the repository:
``` bash

git clone https://github.com/ankush850/background-remover-app.git
cd background-remover-app
```

## (Optional but recommended) Create virtual environment:
```
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```


```
Run the application:

python app.py
```
```
Open browser and visit:

http://localhost:5000
```
## Usage

Open the app in browser

Upload an image

Background is removed automatically

Download the processed image

## Notes

Best results with clear foreground images

Large images may take more processing time
