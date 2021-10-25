import styles from './styles.module.scss'

import logotipo from '../../assets/logo.svg'
import { useEffect, useState } from 'react';
import { api } from '../../services/api'
import { User } from '../../interfaces/UserType';

import io from 'socket.io-client'

type Message = {
    id: string;
    text: string;
    user: User;
    createdAt: Date;
}

const queueMessages: Message[] = [];

const socket = io('https://api-heat.herokuapp.com/');

socket.on('new_message', (newMessage: Message) => {
    queueMessages.push(newMessage)
})

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        setInterval(() => {
            if (queueMessages.length > 0) {
                setMessages(prevState => [
                    queueMessages[0],
                    prevState[0],
                    prevState[1]
                ].filter(Boolean))

                queueMessages.shift()
            }
        }, 3000)
    }, [])

    useEffect(() => {
        async function loadedMessages() {
            const response = await api.get<Message[]>('/api/messages/last3')

            setMessages(response.data)
        }

        loadedMessages()
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logotipo} alt="DoWhile 2021" />

            <ul className={styles.messageList}>
                {
                    messages.map(message => {
                        return (
                            <li className={styles.message} key={message.id}>
                                <p className={styles.messageContent}>{message.text}</p>
                                <div className={styles.messageUser}>
                                    <div className={styles.userImage}>
                                        <img src={message.user.avatar_url} alt={message.user.name} />
                                    </div>
                                    <span>{message.user.name}</span>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}