import { useContext } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import styles from './styles.module.scss';
import { useAuth } from '../../hooks/useAuth';

export function LoginBox() {
    const { signInURL } = useAuth()

    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInURL} className={styles.signInWithGithub}>
                <VscGithubInverted size={24} />
                Entrar com GitHub
            </a>
        </div>
    )
}