from openai import OpenAI, AuthenticationError, APIError

# key - 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

client = OpenAI(
        api_key = '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',
        base_url = "https://openrouter.ai/api/v1"
)


def codemate():
    
    prompt = input("Ask anything : ")
    
    try:
        response = client.chat.completions.create(
            model = "deepseek/deepseek-r1-0528:free",
            messages = [
                {
                    'role':'user',
                    'content':prompt
                }
            ],
            temperature = 0,
            max_tokens = 5000,
            stream = True
        )
        for chunk in response:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content,end='',flush=True)
                
    except AuthenticationError:
        print('Authentication error / API key not working...')
    except APIError as apierr:
        print(f"API error : {apierr}")
    except Exception as exp:
        print(f"Error : {exp}")

codemate()