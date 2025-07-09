from openai import OpenAI, AuthenticationError, APIError

# key - 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
# gpt4o key - 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


client = OpenAI(
        api_key = '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',
        base_url = "https://models.github.ai/inference",
)


def techbuddy():
    
    recent_messages = [] #to have a memory for previous chats
    
    conversation_summary = "The user is interacting with TechBuddy, an expert in Computer Science. Topics so far: None."
    
    while True:
        
        prompt = input("Ask anything : ")
        
        if prompt in ['exit','bye','quit']:
            break
        else:
            try:
                response = client.chat.completions.create(
                    model = "openai/gpt-4.1-mini"   ,
                    messages = [
                        {
                        'role':'system',
                        'content':f'''As an expert in field of Computer Science. Answer questions accurately and with beginner friendly language,
                                Do not reveal any internal reasoning, chain-of-thought, 
                                or thoughts between <think> tags.Only output your final answer to the user. Conversation summary so far:{conversation_summary}''' 
                        }] +
                        recent_messages +
                        [
                            {
                                'role':'user',
                                'content':prompt
                            }
                        ],
                    temperature = 0,
                    max_tokens = 10000,
                    stream = True
                )
                
                full_reply = ""
                
                for chunk in response:
                    if chunk.choices and chunk.choices[0] and chunk.choices[0].delta.content:
                        print(chunk.choices[0].delta.content,end='',flush=True)
                
                
                print()
                
                recent_messages.append({'role':'user', 'content': prompt}) #adding previous chats so bot can remember them
                recent_messages.append({'role':'assistant', 'content': full_reply})

                if len(recent_messages) > 4:
                    recent_messages = recent_messages[-4:] # a hard limit upto 4 chat history 

                conversation_summary += f"\nUser asked: '{prompt[:50]}...'\nBot replied: '{full_reply[:50]}...'\n"

                        
            except AuthenticationError:
                print('Authentication error / API key not working...')
            except APIError as apierr:
                print(f"API error : {apierr}")
            except Exception as exp:
                print(f"Error : {exp}")

techbuddy()