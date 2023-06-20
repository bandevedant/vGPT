import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form=document.querySelector('form');
const chatContainer=document.querySelector('#chat_container');
// const textContent=document.querySelector('textarea');
let loadInterval

const loader=(element)=>{
    element.textContent=''
   loadInterval= setInterval(()=>{
      element.textContent+='.'
      if(element.textContent==='....'){
        element.textContent=''
      }
    },300)
}
const typeText=(element,text)=>{
    let i=0
   
        let interval=setInterval(()=>{
            if(i<text.length){
                element.innerHTML+=text.charAt(i)
                i++
            } else{
            clearInterval(interval);
            }
    },20)
}
const generateuniqueId=()=>{
    const timestamp=Date.now()
    const randomNumber=Math.random()
    const hexadecimalString=randomNumber.toString(16)

    return `id-${timestamp}-${hexadecimalString}`

};
const chatStripe=(isAi,value,uniqueId)=>{
    return(
        `<div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
            <div class="profile">
            <img 
            src="${isAi ? bot: user}" 
            alt="${isAi ? 'bot' : 'user'}"
            />
            </div>
            <div class="message" id=${uniqueId} >${value}</div>
          </div>
      
      </div>`
    )
      
};
const handleSubmit=async(e)=>{
    e.preventDefault()

    const data=new FormData(form)

    //users chatstripe
    chatContainer.innerHTML+=chatStripe(false,data.get('prompt'))

    form.reset()
    //bot chatstripe
    const uniqueId=generateuniqueId()
    chatContainer.innerHTML+=chatStripe(true," ",uniqueId)
     
    // as we move down we can read the message
    chatContainer.scrollTop=chatContainer.scrollHeight

    const messageDiv=document.getElementById(uniqueId)

    loader(messageDiv)

    const response=await fetch('http://localhost:5000',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            // 'Authorization':'Bearer'
        },
        body:JSON.stringify({
            prompt:data.get('prompt')
      })
    })
    clearInterval(loadInterval);
    messageDiv.innerHTML='';

    if(response.ok){
        const data=await response.json();
        const parsedData=data.bot.trim();
        
        typeText(messageDiv,parsedData);
    }
    else{
        const err=await response.text();
        messageDiv.innerHTML="Something went wrong please try again";
        alert(err);
    }
    
    
}
form.addEventListener('submit', handleSubmit)
//enter key press
form.addEventListener('keyup',(e)=>{
   
    if(e.keyCode===13){
        handleSubmit(e)
    }

})

