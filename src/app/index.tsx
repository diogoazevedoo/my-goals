// LIBS
import { useEffect, useRef, useState } from "react"
import { Alert, View, Keyboard } from "react-native"
import Bottom from "@gorhom/bottom-sheet"
import { router } from "expo-router"
import dayjs from "dayjs"

// COMPONENTS
import { Input } from "@/components/Input"
import { Header } from "@/components/Header"
import { Button } from "@/components/Button"
import { BottomSheet } from "@/components/BottomSheet"
import { Goals, GoalsProps } from "@/components/Goals"
import { Transactions, TransactionsProps } from "@/components/Transactions"

// DATABASE
import { useGoalRepository } from "@/database/useGoalRepository"

// UTILS
import { mocks } from "@/utils/mocks"

export default function Home() {
  // LISTS
  const [transactions, setTransactions] = useState<TransactionsProps>([])
  const [goals, setGoals] = useState<GoalsProps>([])

  // FORM
  const [name, setName] = useState("")
  const [total, setTotal] = useState("")

  // DATABASE
  const useGoal = useGoalRepository()

  // BOTTOM SHEET
  const bottomSheetRef = useRef<Bottom>(null)
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand()
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0)

  function handleDetails(id: string) {
    router.navigate("/details/" + id)
  }

  async function handleCreate() {
    try {
      const totalAsNumber = Number(total.toString().replace(",", "."))

      if (isNaN(totalAsNumber)) {
        return Alert.alert("Error", "Invalid value.")
      }

      useGoal.create({ name, total: totalAsNumber })

      Keyboard.dismiss()
      handleBottomSheetClose()
      Alert.alert("Success", "Goal registred!")

      setName("")
      setTotal("")
    } catch (error) {
      Alert.alert("Error", "Register can't be done.")
      console.log(error)
    }
  }

  async function fetchGoals() {
    try {
      const response = useGoal.all()
      setGoals(response)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchTransactions() {
    try {
      const response = mocks.transactions

      setTransactions(
        response.map((item) => ({
          ...item,
          date: dayjs(item.created_at).format("DD/MM/YYYY [at] HH:mm"),
        }))
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGoals()
    fetchTransactions()
  }, [])

  return (
    <View className="flex-1 p-8">
      <Header
        title="Your goals"
        subtitle="Save today to reap the rewards tomorrow."
      />

      <Goals
        goals={goals}
        onAdd={handleBottomSheetOpen}
        onPress={handleDetails}
      />

      <Transactions transactions={transactions} />

      <BottomSheet
        ref={bottomSheetRef}
        title="New goal"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <Input placeholder="Goal name" onChangeText={setName} value={name} />

        <Input
          placeholder="Value"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />

        <Button title="Create" onPress={handleCreate} />
      </BottomSheet>
    </View>
  )
}
