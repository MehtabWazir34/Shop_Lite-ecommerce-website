import React, { useEffect, useState } from 'react'
import { account, DataBases } from '../Auth/Config';
import { Query } from 'appwrite';
import { NavLink } from 'react-router-dom';

function MessagesHistory() {
    let [myMsgs, setMsgs] = useState([]);

    useEffect(()=>{
    const getMessageHistory = async ()=>{
        try {
            let user = await account.get();
            let msgsData = await DataBases.listDocuments(
                import.meta.env.VITE_APPWRITE_DB_ID,
                import.meta.env.VITE_APPWRITE_MessagesTable,
                [
                    Query.equal("userId", user.$id)
                ]
            )
            setMsgs(msgsData.documents)
        } catch (error) {
            console.log('Error: ', error);
            
        }
    }
    getMessageHistory();
}, [] )
  return (
    <div >
      
       <div className= {`bg-transparent backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 mb-8 `}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Messages
            </h3>
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {myMsgs.length} messages
            </span>
          </div>

          {myMsgs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💌</div>
              <p className="text-gray-500 text-lg mb-4">No messages sent yet.</p>
              <NavLink 
                to="/contactform" 
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Send Your First Message
              </NavLink>
            </div>
          ) : (
            <div className="space-y-2">
              {myMsgs.map(message => (
                <div key={message.id} className={` rounded-xl p-2 shadow-lg transition-all duration-300 `}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-500 text-lg">{message.UserName}</p>
                      <p className="text-gray-500 text-sm">{message.Email}</p>
                    </div>
                    <span className="text-sm px-3 py-1 rounded-full">
                      {new Date(message.$createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <p className=" mb-4 leading-relaxed">{message.Message}</p>
                  
                  {/* <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      message.status === 'unread' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {message.status === 'unread' ? '⏳ Unread' : '✅ Read'}
                    </span>
                    <span className="text-xs text-gray-500">Message ID: {message.id}</span>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  )
}

export default MessagesHistory
