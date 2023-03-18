import * as React from 'react';
import { DatePicker, DatePickerProps, TimePicker, TimePickerProps } from '@mui/lab';
import { FormikValues } from 'formik';
import { get } from 'lodash';
import { IFieldProps } from '..';

export interface IMUIDatePickerProps extends DatePickerProps<any> {
    outputFormat?: string
}

export const MUIDatePicker: React.FC<IFieldProps & { fieldProps?: IMUIDatePickerProps }> = (props) => {
    const { fieldProps = {} as IMUIDatePickerProps, formikProps = {} as FormikValues } = props;
    const value = get(formikProps, `values.${fieldProps.name}`);
    //const [selectedDate, setSelectedDate] = React.useState<MaterialUiPickersDate | null>(initValue ? initValue : null);
    const fieldError = get(formikProps, `errors.${fieldProps.name}`);
    const { outputFormat, ...datePickerProps } = fieldProps;
    const handleDateChange = (date: any | null) => {
        //setSelectedDate(date);
        if (!date) {
            formikProps.setFieldValue(fieldProps.name, date, false);
            return;
        }
        const dateValue = (outputFormat === 'date') ? date : date.format(outputFormat || fieldProps.format || 'MM/DD/YYYY');
        formikProps.setFieldValue(fieldProps.name, dateValue, false);
    };
    const updatedProps = {
        ...datePickerProps,
        error: !!fieldError,
        helperText: (fieldError || ''),
        onChange: handleDateChange,
        value: (!value) ? null : undefined,
        inputValue: (!value) ? '' : value,
        format: fieldProps.format || 'MM/DD/YYYY',

        onError: (error: React.ReactNode) => {
            // handle as a side effect
            if (error !== fieldError) {
                formikProps.setFieldError(fieldProps.name, error);
            }
        }
    };

    return (
        <DatePicker
            {...updatedProps}
        />
    )
}

export const MUITimePicker: React.FC<IFieldProps & { fieldProps?: TimePickerProps<any> }> = props => {
    const { fieldProps = {} as TimePickerProps<any>, formikProps = {} as FormikValues } = props;
    const fieldError = get(formikProps, `errors.${fieldProps.name}`);
    const value = get(formikProps, `values.${fieldProps.name}`);
    const handleTimeChange = (time: any | null) => {
        if (time === null)
            formikProps.setFieldValue(fieldProps.name, time, false);
        else
            formikProps.setFieldValue(fieldProps.name, new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }), false)
    }
    const updatedProps = {
        ...fieldProps,
        error: !!fieldError,
        helperText: (fieldError || ''),
        onChange: handleTimeChange,
        value: (!value) ? null : undefined,
        inputValue: (!value) ? '' : value,
        onError: (error: React.ReactNode) => {
            if (error !== fieldError) {
                formikProps.setFieldError(fieldProps.name, error);
            }
        },
    };
    return (
        <TimePicker  {...updatedProps} />
    )
}

