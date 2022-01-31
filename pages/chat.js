import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { createClient } from '@supabase/supabase-js'
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import { Preloader, Oval } from 'react-preloader-icon';

import GitUser from './gitInfo'

import ButtonSendSticker from '../components/ButtonSendSticker'

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxMTYxMCwiZXhwIjoxOTU4ODg3NjEwfQ.ulYq6EyQLPuh1XPRcwM-Bfi7rs1udA_1ZlNo-NUXLX8'

const SUPABASE_URL = 'https://rilsuobwcbmeqwkpmwan.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const useStyles = makeStyles(theme => ({
    popover: {
        pointerEvents: "none"
    },
    paper: {
        padding: theme.spacing(3)
    }
}));

function RealTimeMsg(novaMensagem){
    return supabaseClient
    .from('mensagem')
    .on('INSERT', (respostaAutomatica)=>{
        novaMensagem(respostaAutomatica.new)
        console.log('escutado')
    })
    .subscribe();
}
export default function ChatPage() {
    // Sua lógica vai aqui
    // Usuario digita no campo
    // Usuario aperta para enviar
    // Tem que adicionar o texto na listagem

    // DEV :
    // {X} Campo criado
    // {X} Vamos usar o onChange usa o useState ( ter if caso seja enter para enviar)
    // Lista de mensagem

    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const [loading,setLoading]=React.useState(true)
    const router = useRouter()
    React.useEffect(() => {
        supabaseClient
            .from('mensagem')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                console.log(data)
                setListaDeMensagens(data);
            });
        const subscription = RealTimeMsg((novaMensagem)=>{
            // handleNovaMensagem(novaMensagem)
            setListaDeMensagens((valorAtualDaLista)=>{
                return [                       
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
        });

        return () => {
            subscription.unsubscribe()
        }
    }, []);
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: router.query.username,
            texto: novaMensagem,
        };
        supabaseClient
            .from('mensagem')
            .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
                mensagem
            ])
            .then(({ data }) => {
                //Se não da bug
                // setListaDeMensagens([
                //     data[0],
                //     ...listaDeMensagens,
                // ]);
            });
        setMensagem('');
    }
    React.useEffect(() => {
        supabaseClient
          .from('mensagens')
          .select('*')
          .order('created_at',{ascending:false})
          .then(({ data }) => {
            //console.log('Dados da consulta:', data);
            if(data!=null){
                setListaDeMensagens(data);
            }

            setLoading(false)
          });
        }, []);
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
                styleSheet={loading?{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: '#010101',
                    height: '80%',
                    maxWidth: '75%',
                    maxHeight: '95vh',
                    padding: '32px',
                    }:{
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
                    styleSheet={loading?{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: '#010101',
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }:{
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
                    {
                        loading? <Box
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent:'center'
                        }}>
                        <Image
                                styleSheet={{
                                    width: '500px',
                                    height: '300px',
                                    display: 'cover',
                                    marginRight: '8px',
                                    marginBottom:'100px'
                                }}
                                src={`https://i.ytimg.com/vi/1jUqzFMo0kk/maxresdefault.jpg`}
                            />
                        </Box>
                        :<MessageList mensagens={listaDeMensagens} setMensagem={setListaDeMensagens} />
                    }

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
                        <ButtonSendSticker 
                            onStickerClick={(sticker)=>{
                                console.log(sticker)
                                handleNovaMensagem(':sticker:'+sticker);
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
    const router = useRouter()
    // Constantes do Popover
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [perfil, setPerfil] = React.useState('')

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const classes = useStyles()

    // Função para deletar a mensagem
    const delMensage = async (mensagem) => {
        await supabaseClient
            .from('mensagem')
            .delete()
            .match({ id: mensagem.id })

        // Filtrando para encontrar a mensagem certa
        let newLista = props.mensagens.filter((elementoDeMensagem) => {
            return mensagem.id !== elementoDeMensagem.id
        })
        //Definindo a nova lista
        props.setMensagem(newLista)
    }
    //Constante para recarregamento
    const [vazio, setVazio] = React.useState('')

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
                const handlePopoverOpen = (event) => {
                    if (mensagem.de === event.currentTarget.src.slice(19, -4)) {
                        setAnchorEl(event.currentTarget);
                        setPerfil(event.currentTarget.src.slice(19, -4))
                        console.log(mensagem.de, '1', event.currentTarget.src.slice(19, -4))
                    }
                };
                const open = Boolean(anchorEl);
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
                           {router.query.username === mensagem.de? <Button
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
                            />: null}
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={handlePopoverClose}

                            />
                            {/* // -----------Ver o porque não está funcionando o href  */}
                            <Text tag='a' href={`https://github.com/${mensagem.de}`}>{mensagem.de}</Text>
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
                        {mensagem.texto.startsWith(':sticker:')?
                        <Image src={mensagem.texto.replace(':sticker:','')} styleSheet={{
                            maxWidth:'150px'
                            }} />
                        :mensagem.texto
                        }
                        <Popover
                            id="mouse-over-popover"
                            className={classes.popover}
                            classes={{
                                paper: classes.paper
                            }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left"
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left"
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus

                        >
                            <GitUser username={perfil} Close={handlePopoverClose} />
                        </Popover>
                    </Text>
                );
            })}
        </Box>
    )
}