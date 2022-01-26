import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';

export default function ChatPage() {
    // Sua lógica vai aqui
      // Usuario digita no campo
      // Usuario aperta para enviar
      // Tem que adicionar o texto na listagem

      // DEV :
         // {X} Campo criado
         // {X} Vamos usar o onChange usa o useState ( ter if caso seja enter para enviar)
         // Lista de mensagem
    // ./Sua lógica vai aqui
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            id: listaDeMensagens.length + 1,
            de: 'vanessametonini',
            texto: novaMensagem,
        };

        setListaDeMensagens([
            mensagem,
            ...listaDeMensagens,
        ]);
        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(http://vignette4.wikia.nocookie.net/eldragonverde/images/0/03/Isengard.jpg/revision/latest/scale-to-width-down/2000?cb=20130103153320&path-prefix=es)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '80%',
                    maxWidth: '75%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} setMensagem= {setListaDeMensagens} />
                    
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        onSubmit={function (infosDoEvento) {
                            infosDoEvento.preventDefault();
                            handleNovaMensagem(mensagem);
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            type='submit'
                            label='Enviar'
                            styleSheet={{
                                backgroundImage: 'url(http://1.bp.blogspot.com/-MtSstBScfZQ/TzlX5shDsEI/AAAAAAAABS0/c8Zxz0PjeVA/w1200-h630-p-k-no-nu/Eye-of-Sauron,-Lord-of-the-Rings,-Return-of-the-King.jpg)',
                                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                            }}
                            buttonColors={{
                                contrastColor: '#ffee94',
                                mainColor: '#1d1d1d',
                                mainColorLight: 'yellow',
                                mainColorStrong: 'red',
                            }}
                        />
                    </Box>
                </Box>
            </Box>            
        </Box>
        
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    // Função para deletar a mensagem
    const delMensage = (mensagem) =>{
        // Filtrando para encontrar a mensagem certa
        let newLista = props.mensagens.filter((elemento) =>{
            return mensagem.id !== elemento.id
        })
        //Definindo a nova lista
        props.setMensagem(newLista)
    }
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Button
                                onClick={() => {
                                    // Função para deletar as mensagens no clique
                                    delMensage(mensagem)
                                }}
                                styleSheet={{
                                    backgroundImage: 'url(https://www.netclipart.com/pp/m/210-2105805_red-crossed-swords-png.png)', 
                                    backgroundRepeat: 'no-repeat',  
                                    backgroundSize: 'cover',
                                    marginLeft: '95%',
                                    backgroundColor: appConfig.theme.colors.neutrals[600],
                                }}
                            />
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/vanessametonini.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            
                        </Box>
                        {mensagem.texto}
                    </Text>
                );
            })}
        </Box>
    )
}