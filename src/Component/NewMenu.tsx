import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IMenu } from '../Utils/Models/Menu'
import { useHistory } from 'react-router-dom';
interface IMenuProps {
    menu: IMenu[];
}

const NewMenu = (props: IMenuProps) => {
    let h = useHistory()
    const redirect = (link: string) => {
        h.push(link)
    }
    return (
        <List>
            {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
            ))} */}
            {
                props.menu.map((item, index) => (
                    <ListItem button key={index}>
                        <ListItemIcon onClick={() => {redirect(item.link)}}>{item.icon}</ListItemIcon>
                        <ListItemText onClick={() => {redirect(item.link)}} primary={item.opcion} />
                    </ListItem>
                ))
            }
        </List>
    )
}

export default NewMenu;