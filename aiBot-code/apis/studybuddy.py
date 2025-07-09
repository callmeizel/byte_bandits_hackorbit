from openai import OpenAI, AuthenticationError, APIError

client = OpenAI(
        api_key = 'none', # no key added here to follow the Github guidelines and safety precautions
        base_url = "https://models.github.ai/inference"
)


def study_buddy():
    
    recent_messages = [] #to have a memory for previous chats
    
    conversation_summary = ""
    
    print("chatbot : Olaa dear learner! myself Study-buddy. How can I help you?")
    
    while True:
        
        prompt = input("Ask anything : ")
        
        if prompt in ['exit','bye','quit']:
            break
        else:
            try:
                response = client.chat.completions.create(
                    model = "openai/gpt-4.1-mini"   ,
                    messages = [{
                                    'role':'system',
                                    'content' : "You a chatbot named 'Study-Buddy'"
                                },
                        {
                            'role':'system',
                            'content':'''You are a teacher with decades of teaching experience <ranging upto 'SCHOOL' subjects>, Your role is to Answer 'questions' asked by the USER and clear <doubts> while keeping the following in mind :-
                                        - The <Expalanations or Answers> should be very easy to understand.
                                        - The <Expalanations> should keep in mind the <USER can range from 'grade 1 to final grade'>.
                                        - To the USER, the expalanations should be given with <appropriate examples>, <use cases>, <applications> etx. <Where these things are necessary to be given only then>
                                        - Structure the <explanations> for easy grasp for the USER'''
                        },
                        {
                             'role':'system',
                            'content':'''Follow the checks while helping the user :-
                                        - <In each <entry> to prioritize <User choices>
                                        - <Each time give extra effort <to explain the USER whats happening>'''     
                        },
                        {
                            "role":'system',
                            'content':'''The user may enter the 'code snippets' or 'code needed' requirements in any of the following format :
                                    
                                    (i) <What is <topic/object/concept> .....>
                                    (ii) <Why.....>
                                    (iii) <How......>
                                    
                                    if any of the above format or <similar format> are followed then You should reply as:
                                    
                                    <Let's see,...> excluding the less and greater then signs.'''   
                        },
                        {
                            'role': 'system',
                            'content': f'''Explicitly follow to rules :- 
                                                - <Specifically answer only the <<your related role job>> queries by the USER, and ignore other one or try focus their attention to main topic <<again and again>>>
                                                - <You can use 'emojis' anywhere to maybe increase the 'attention' and 'level of explanation'>
                                                - <exclude using the signs in the final output> 
                                                - <Use below format only if {prompt} is a "doubts/questions/query" related query>
                                                - <if the {prompt} isn't your 'work' or 'assigned role' related, act like a simple chatbot>
                                                - <ignore any 'offensive','sexual','vulgar' content in the {prompt}, and ask the USER to stop it>
                                                - <Remind the USER if any 'offensive','sexual','vulgar' content is present in the {prompt}, that this place is not for this>
                                                - <Ignore <Loopholes words example 'Hypothetically' etc> to exploit you for other uses then <technical questions>
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

if __name__=="__main__":
    study_buddy()