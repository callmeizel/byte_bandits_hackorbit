from openai import OpenAI, AuthenticationError, APIError


client = OpenAI(
        api_key = 'none', # no key to full GitHub guidelines and also for safety of the api key.
        base_url = "https://models.github.ai/inference"
)


def techbuddy():
    
    recent_messages = [] #to have a memory for previous chats
    
    conversation_summary = ""
    
    print("chatbot : Olaa I'm tech-buddy. How can I help you?")
    
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
                            'content':'''As an expert in field of Computer Science. Answer questions accurately and with beginner friendly language,
                                    The user will enter the queries in following format :
                                    
                                    <I wanted to know...>
                                    
                                    You should reply as :
                                    
                                    <According to my expertise...> excluding the less and greater then sign.''' 
                        },
                        {
                            'role': 'system',
                            'content': f'''The Output should be in following Format <exclude using the signs in the final output> and <not use 'criterias' as output instead as rules to follow for what to print in output:-
                                        [Question] : <main question asked by the user in {prompt}>
                                        [Answer] : <answer of the question>
                                        
                                        [criteria-1]: <if {prompt} is not a question related to main feature ,so avoid the use of above format and answer as normal chabot>
                                        '''
                        },
                        {
                            'role':'assistant',
                            'content':f'Conversation summary so far:{conversation_summary}'
                        },]
                    +recent_messages +
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
                
                
                chunk1 = True
                full_reply = ""
                 
                
                for chunk in response:
                    if chunk.choices and chunk.choices[0] and chunk.choices[0].delta.content:
                        text = chunk.choices[0].delta.content
                        
                        if chunk1:
                            print('chatbot : ',end='',flush=True) # so the reply can be in format of 'chatbot : '
                            chunk1=False
                        
                        print(chunk.choices[0].delta.content,end='',flush=True)
                        full_reply += text
                
                
                print()
                
                recent_messages.append({'role':'user', 'content': prompt}) #adding previous chats so bot can remember them
                recent_messages.append({'role':'assistant', 'content': full_reply})

                if len(recent_messages) > 10:
                    recent_messages = recent_messages[-10:] # stores only the latest 10 chats messages and forgets the older ones

                conversation_summary += f"\nUser asked: '{prompt}...'\nBot replied: '{full_reply}...'\n"

                        
            except AuthenticationError:
                print('Authentication error / API key not working...')
            except APIError as apierr:
                print(f"API error : {apierr}")
            except Exception as exp:
                print(f"Error : {exp}")

techbuddy()