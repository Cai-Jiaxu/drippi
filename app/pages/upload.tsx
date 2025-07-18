//Index.tsx

'use client'

import { Check } from 'lucide-react'
import { useOutfitForm } from '../src/hooks/useOutfitForm'
import ErrorDisplay from '../src/components/upload/ErrorDisplay'
import SuccessDisplay from '../src/components/upload/SuccessDisplay'
import UploadForm from '../src/components/upload/UploadForm'

export default function UploadPage() {
  const {
    formData,
    errors,
    submitting,
    success,
    updateField,
    resetForm,
    submitForm,
  } = useOutfitForm()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-purple-700 dark:text-purple-400 mb-2">
            Share Your Style
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            List your outfit and start earning in minutes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          {/* Progress indicator */}
          <div className="bg-purple-600 dark:bg-purple-700 px-6 py-4">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${success ? 'bg-green-400' : 'bg-white'} mr-3`}>
                {success ? (
                  <Check className="w-5 h-5 text-purple-700" />
                ) : (
                  <span className="text-purple-700 font-bold">1</span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-white">
                {success ? 'Upload Complete!' : 'Outfit Details'}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {success ? (
              <SuccessDisplay onListAnother={resetForm} />
            ) : (
              <>
                <ErrorDisplay errors={errors} />
                <UploadForm
                  formData={formData}
                  submitting={submitting}
                  updateField={updateField}
                  onSubmit={submitForm}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}