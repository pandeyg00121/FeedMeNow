import { Grid,Heading,Container,VStack,Input,Image,Button,Select,Textarea} from '@chakra-ui/react'
import {useState} from 'react'
import cursor from "../../../assets/cursor red.png"
import { RiArrowDownLine, RiArrowUpLine} from 'react-icons/ri'
import { DoughnutChart, LineChart } from './Chart'
import Sidebar from './Sidebar'

export const fileUploadCss={
    cursor:"pointer",
    marginLeft:"-5%",
    width:"110%",
    border:'none',
    height:'100%',
    color:'#ECC94B',
    backgroundColor:'red'
}

const AddNewItem = () => {
  const [name,setName]=useState("");
  const [description,setDescription]=useState("");
  const [price,setPrice]=useState("");
  const [category,setCategory]=useState("");
  const [image,setImage]=useState("");
  const [imagePrev,setImagePrev]=useState("");

  const categories=[
    'Chinese',
    'Beverages',
    'North Indian',
    'Dessert',
    'South Indian',
    'Fast Food' ]

const changeImageHandler=(e)=>{
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
        setImagePrev(reader.result);
        setImage(file)
    }
  }

  return (
    <Grid css={{
        cursor:`url(${cursor}),default`
    }} minH={'100vh'} templateColumns={['1fr','5fr 1fr']}>
      <Container py="16">
       <form>
       <Heading textTransform={'uppercase'} size={"lg"} children="Add New Item To Your Menu" my={"16"} textAlign={["center","left"]}/>
       <VStack m={"auto"} spacing={"8"}>
       <Input 
       value={name} 
       onChange={e=>setName(e.target.value)}
       placeholder="Name"
       type="text"
       focusBorderColor="red.300"
       />
       <Textarea 
       value={description} 
       onChange={e=>setDescription(e.target.value)}
       placeholder="Description"
       focusBorderColor="red.300"
       />
       <Input 
       value={price} 
       onChange={e=>setPrice(e.target.value)}
       placeholder="Price"
       type="number"
       focusBorderColor="red.300"
       />
       <Select focusBorderColor="red.300" value={category}
       onChange={e=>setCategory(e.target.value)}
       >
       <option value="">Category</option>
       {categories.map(item=>(
        <option key={item} value={item}>{item}</option>
       ))}
       </Select>
       <Input
           accept="image/*"
            required
            type="file"
            focusBorderColor="purple.300"
            css={{
              "&::file-selector-button":{
                ...fileUploadCss,
                color:'black',
                fontWeight:"bold"
              }
            }}
            onChange={changeImageHandler}
           />
           {imagePrev && (
            <Image src={imagePrev} boxSize={"64"} objectFit={"contain"} rounded={"lg"} boxShadow={'-2px 0 15px rgba(255,0,0,0.5)'}/>
           )}
           <Button w={"full"} colorScheme='green' type='submit' fontWeight={"bold"}>Create</Button>
       </VStack>
       </form>
      </Container>
      <Sidebar/>
    </Grid>
  )
}

export default AddNewItem;


