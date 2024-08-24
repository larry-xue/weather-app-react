import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function AddCollectionDialog({ handleAddRegion, coordinates }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  const handleOpenDialog = () => {
    setOpen(true)
  }

  const handleAddCollection = () => {
    try {
      if (!name) {
        throw new Error('Name is required')
      }
      handleAddRegion(name, coordinates)
      setOpen(false)
      setName('')
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    if (open) {
      setError(null)
      setName('')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className='bg-lime-400 p-2 rounded-md' title="Add Region to Collection" onClick={handleOpenDialog}><Star /></Button>
      </DialogTrigger>
      <DialogContent describedby="add-collection-dialog">
        <DialogTitle>Add a region to your collection</DialogTitle>
        <DialogDescription>
          Type the name of the region and click add to add it to your collection
        </DialogDescription>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              maxLength={32}
              autoFocus={true}
              required={true}
              autoComplete="off"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddCollection}>Add</Button>
        </DialogFooter>
        {error && <DialogFooter><p className="text-red-500">{error.message}</p></DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
