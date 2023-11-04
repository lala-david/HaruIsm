import requests
import json
import urllib
from flask import Flask, request, jsonify
from PIL import Image
import base64

def translate_text(text, source, target):
    client_id = ''
    client_secret = ''
    encText = urllib.parse.quote(text)
    data = f'source={source}&target={target}&text={encText}'
    url = 'https://openapi.naver.com/v1/papago/n2mt'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
    }
    response = requests.post(url, data=data, headers=headers)
    rescode = response.status_code
    if rescode == 200:
        response_body = response.json()
        return response_body['message']['result']['translatedText']
    else:
        return ''

app = Flask(__name__)


REST_API_KEY = ''

def t2i(prompts):

    prompt = ', '.join(prompts)

    r = requests.post(
        'https://api.kakaobrain.com/v2/inference/karlo/t2i',
        json={
            'prompt': prompt,

        },
        headers={
            'Authorization': f'KakaoAK {REST_API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    # 응답 JSON 형식으로 변환
    response = json.loads(r.content)
    return response

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.get_json()
    text = data['text']


    translated_text = translate_text(text, 'ko', 'en')


    prompt = [translated_text] + data.get('prompt', ["animation, ghibli, 8k, full size, abstract,  8k pastel tones, 8k abstract painting, realistic, arts therapy, 8k toystory"])


    response = t2i(prompt)


    img_url = response.get("images")[0].get("image")


    img_response = requests.get(img_url)
    img_data = img_response.content

    img_base64 = base64.b64encode(img_data).decode('utf-8')

    return jsonify({'translated_text': translated_text, 'image': img_base64})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
