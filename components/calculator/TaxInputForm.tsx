'use client'

import * as React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { TaxCalculatorInputs } from '@/types/calculator'

interface Props {
    onInputChange: (inputs: TaxCalculatorInputs) => void
    initialValues: TaxCalculatorInputs
}

export function TaxInputForm({ onInputChange, initialValues }: Props) {
    const [inputs, setInputs] = React.useState<TaxCalculatorInputs>(initialValues)

    const handleChange = (path: string, value: any) => {
        const newInputs = { ...inputs }
        const keys = path.split('.')
        let current: any = newInputs

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value

        setInputs(newInputs)
        onInputChange(newInputs)
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val)
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 mb-8">
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="deductions">Deductions</TabsTrigger>
                    <TabsTrigger value="gains">Capital Gains</TabsTrigger>
                </TabsList>

                <TabsContent value="income" className="space-y-6">
                    <Card className="bg-background/50 border-border/40 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl">Sources of Income</CardTitle>
                            <CardDescription>Enter your annual earnings from all sources.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="salary">Annual Gross Salary</Label>
                                    <span className="font-mono text-primary font-semibold">{formatCurrency(inputs.income.salary)}</span>
                                </div>
                                <Slider
                                    defaultValue={[inputs.income.salary]}
                                    max={10000000}
                                    step={50000}
                                    onValueChange={(vals) => {
                                        const val = Array.isArray(vals) ? vals[0] : vals;
                                        handleChange('income.salary', val);
                                    }}
                                    className="py-4"
                                />
                                <Input
                                    id="salary"
                                    type="number"
                                    value={inputs.income.salary}
                                    onChange={(e) => handleChange('income.salary', Number(e.target.value))}
                                    className="bg-muted/20"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="interest">Interest Income (Bank, FDs)</Label>
                                    <Input
                                        id="interest"
                                        type="number"
                                        value={inputs.income.interest}
                                        onChange={(e) => handleChange('income.interest', Number(e.target.value))}
                                        className="bg-muted/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rental">Annual Rental Income</Label>
                                    <Input
                                        id="rental"
                                        type="number"
                                        value={inputs.income.rental}
                                        onChange={(e) => handleChange('income.rental', Number(e.target.value))}
                                        className="bg-muted/20"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="deductions" className="space-y-6">
                    <Card className="bg-background/50 border-border/40 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl">Exemptions & Deductions</CardTitle>
                            <CardDescription>Only applicable under the Old Regime (except Standard Deduction).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="80c">Section 80C (LIC, PPF, ELSS)</Label>
                                    <Input
                                        id="80c"
                                        type="number"
                                        max={150000}
                                        value={inputs.deductions.section80C}
                                        onChange={(e) => handleChange('deductions.section80C', Number(e.target.value))}
                                        className="bg-muted/20"
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Max limit applies (1.5L)</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="80d">Section 80D (Health Insurance)</Label>
                                    <Input
                                        id="80d"
                                        type="number"
                                        value={inputs.deductions.section80D}
                                        onChange={(e) => handleChange('deductions.section80D', Number(e.target.value))}
                                        className="bg-muted/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hra">HRA Exemption</Label>
                                    <Input
                                        id="hra"
                                        type="number"
                                        value={inputs.deductions.hra}
                                        onChange={(e) => handleChange('deductions.hra', Number(e.target.value))}
                                        className="bg-muted/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="standard">Standard Deduction (Salaried)</Label>
                                    <Input
                                        id="standard"
                                        type="number"
                                        disabled
                                        value={inputs.deductions.standardDeduction}
                                        className="bg-muted/20 opacity-70"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Auto-applied: 75k (New) / 50k (Old)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="gains" className="space-y-6">
                    <Card className="bg-background/50 border-border/40 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl">Capital Gains</CardTitle>
                            <CardDescription>Gains from shares, real estate, or other assets.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ltcg">LTCG (Equity/Property)</Label>
                                <Input
                                    id="ltcg"
                                    type="number"
                                    value={inputs.capitalGains.ltcg_12_5}
                                    onChange={(e) => handleChange('capitalGains.ltcg_12_5', Number(e.target.value))}
                                    className="bg-muted/20"
                                />
                                <p className="text-[10px] text-muted-foreground">New rate: 12.5%</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stcg">STCG (Equity)</Label>
                                <Input
                                    id="stcg"
                                    type="number"
                                    value={inputs.capitalGains.stcg_20}
                                    onChange={(e) => handleChange('capitalGains.stcg_20', Number(e.target.value))}
                                    className="bg-muted/20"
                                />
                                <p className="text-[10px] text-muted-foreground">New rate: 20%</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
